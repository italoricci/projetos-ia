importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest');

const MODEL_PATH = `yolov5n_web_model/model.json`;
const LABELS_PATH = `yolov5n_web_model/labels.json`;
const INPUT_DIMENSION = 640; // YOLOv5n espera entradas de 640x640
const CLASS_THRESHOLD = 0.4; // limiar de confiança para filtrar previsões fracas

let _labels = [];
let _model = null;

async function loadModelAndLabels() {
	await tf.ready();

	_labels = await fetch(LABELS_PATH).then((res) => res.json()); // carregando labels
	_model = await tf.loadGraphModel(MODEL_PATH); // carregando modelo;

	// aquecimento do modelo para reduzir latência na primeira previsão (warmup)
	const dummyInput = tf.ones(_model.inputs[0].shape);
	// executando modelo
	await _model.executeAsync(dummyInput);
	// obrigatorieamente liberar memória do tensor dummy após uso, pois pode haver vazamento de memória se não for descartado
	tf.dispose(dummyInput);

	postMessage({
		type: 'model-loaded',
	});
}

/**
 * O modelo espera uma entrada de imagem de 640x640 pixels, então esta função redimensiona
 * a imagem para as dimensões corretas e normaliza os valores dos pixels para o intervalo [0, 1].
 * O resultado é um tensor 4D com forma [1, 640, 640, 3], onde o primeiro dimension é o tamanho do lote (batch size)
 * e os outros três dimensions correspondem à altura, largura e canais de cor da imagem.
 *
 * @param {*} input - ImageBitmap extraído do canvas do jogo, que contém a cena atual do jogo.
 * @returns {tf.Tensor4D} - Tensor pré-processado pronto para ser alimentado no modelo YOLOv5n
 */
function preprocessImage(input) {
	// tf.tidy é usado para garantir que os tensores intermediários sejam liberados da memória automaticamente, evitando vazamentos de memória
	return tf.tidy(() => {
		// converter ImageBitmap para tensor [H, W, 3]
		let imgTensor = tf.browser.fromPixels(input);
		// redimensionar para o tamanho esperado pelo modelo (640x640)
		imgTensor = tf.image.resizeBilinear(imgTensor, [
			INPUT_DIMENSION,
			INPUT_DIMENSION,
		]);
		// adicionar dimensão de lote [1, H, W, 3] e normalizar para [0, 1]
		imgTensor = imgTensor.expandDims(0);
		// normalizar pixel values para [0, 1]
		imgTensor = imgTensor.div(255.0);
		return imgTensor;
	});
}

/**
 *
 * @param {*} tensor
 */
async function runInference(tensor) {
	const output = await _model.executeAsync(tensor);

	// assumir que as 3 primeiras saídas são caixas delimitadoras,
	// pontuações e classes, respectivamente
	const [boxes, scores, classes] = output.slice(0, 3);
	const [boxesData, scoresData, classesData] = await Promise.all([
		boxes.data(),
		scores.data(),
		classes.data(),
	]);

	output.forEach((t) => t.dispose()); // liberar memória de todos os tensores de saída

	return {
		boxes: boxesData,
		scores: scoresData,
		classes: classesData,
	};
}

/**
 * Filta e processa predições do modelo;
 * - Aplicar limiar de confiança para filtrar previsões fracas baseada no CLASS_THRESHOLD definido;
 * - Filtrar apenas previsões da classe 'kite', que representa os patos nesse caso, usando o array de labels carregado;
 * - Converter as coordenadas normalizadas das caixas delimitadoras para coordenadas de pixel, considerando as dimensões originais da imagem de entrada;
 *
 * @param {*} param0
 * @param {*} width
 * @param {*} height
 */
function* processPredicition({ boxes, scores, classes }, width, height) {
	for (let i = 0; i < scores.length; i++) {
		if (scores[i] < CLASS_THRESHOLD) continue; // filtrar previsões com baixa confiança
		const label = _labels[classes[i]] || 'unknown';
		if (label !== 'kite') continue; // filtrar apenas previsões de 'kite' -> patos nesse caso
		let [x1, y1, x2, y2] = boxes.slice(i * 4, (i + 1) * 4); // extrair coordenadas da caixa delimitadora
		x1 *= width; // converter coordenadas normalizadas para pixels
		y1 *= height;
		x2 *= width;
		y2 *= height;

		const boxWidth = x2 - x1;
		const boxHeight = y2 - y1;
		const centerX = x1 + boxWidth / 2; // calcular centro da caixa para mira
		const centerY = y1 + boxHeight / 2;

		yield {
			score: (scores[i] * 100).toFixed(2),
			x: centerX,
			y: centerY,
		};
	}
}

loadModelAndLabels();

self.onmessage = async ({ data }) => {
	if (data.type !== 'predict') return;
	if (!_model) return;
	const input = preprocessImage(data.image);
	const { width, height } = data.image;
	const inferenceResult = await runInference(input);
	for (const predictions of processPredicition(
		inferenceResult,
		width,
		height,
	)) {
		console.log(
			`🎯 AI predicted at: (${predictions.x}, ${predictions.y}) with confidence ${predictions.score}%`,
		);
		postMessage({
			type: 'prediction',
			...predictions,
		});
	}
};

console.log('🧠 YOLOv5n Web Worker initialized');
