import 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js';
import { workerEvents } from '../events/constants.js';

console.log('Model training worker initialized');

let _globalCtx = {};
let _model = null;

// Categoria é mais importante para recomendacao (definir da recomendação)
// Abaixo os pesos.
const WEIGHT = {
	category: 0.4,
	color: 0.3,
	price: 0.2,
	age: 0.1,
};

// Normalizacao continua os valores (preço e idade), no range de 0-1;
// Pq? Mantem todas as variaveis balanceadas para que nenhuma domine o treino
// Formula: (val - min) / (max - min)
// Exemplo: price=129,99, min=39,99, max=199.99 ->  (129,99 - 39,00) / (199,99 - 39,99) 0.56
const normalize = (valor, min, max) => (valor - min) / (max - min || 1);

// Criacao de contexto
function makeContext(products, users) {
	// aplicar a normalizacao;
	// aplicar pesos para os atributos
	const ages = users.map((user) => user.age);
	const prices = products.map((products) => products.price);
	const colorsMap = products.map((products) => products.color);
	const categoriesMap = products.map((products) => products.category);

	const minAge = Math.min(...ages);
	const maxAge = Math.max(...ages);

	const minPrice = Math.min(...prices);
	const maxPrice = Math.max(...prices);

	const colors = [...new Set(colorsMap)];
	const categories = [...new Set(categoriesMap)];

	const colorIndex = getIndex(colors);
	const categoryIndex = getIndex(categories);

	/// computar a media de idade dos comprodadores por produto (ajuda a personalizar);
	const midAge = (minAge + maxAge) / 2;
	const ageSums = {};
	const ageCounts = {};

	users.forEach((user) => {
		user.purchases.forEach((p) => {
			ageSums[p.name] = (ageSums[p.name] || 0) + user.age;
			ageCounts[p.name] = (ageCounts[p.name] || 0) + 1;
		});
	});

	const productAvgNorm = Object.fromEntries(
		products.map((p) => {
			const avg = ageCounts[p.name]
				? ageSums[p.name] / ageCounts[p.name]
				: minAge;
			return [p.name, normalize(avg, minAge, maxAge)];
		}),
	);

	return {
		products,
		users,
		colorIndex,
		categoryIndex,
		minAge,
		maxAge,
		minPrice,
		maxPrice,
		numCategories: categories.length,
		numColors: colors.length,
		// precos + categorias + cores
		dimentions: 2 + categories.length + colors.length,
		productAvgNorm,
		midAge,
	};
}

function getIndex(entries) {
	return Object.fromEntries(
		entries.map((obj, index) => {
			return [obj, index];
		}),
	);
}

const oneHotWeight = (index, length, weight) =>
	tf.oneHot(index, length).cast('float32').mul(weight);

function encodeProduct(product, context) {
	// normalizando dados para ficar de 0 e 1 e aplicar o peso na recomendacao;
	const price = tf.tensor1d([
		normalize(product.price, context.minPrice, context.maxPrice) * WEIGHT.price,
	]);

	const age = tf.tensor1d([
		(context.productAvgNorm[product.name] ?? 0.5) * WEIGHT.age,
	]);

	const category = oneHotWeight(
		context.categoryIndex[product.category],
		context.numCategories,
		WEIGHT.category,
	);
	const color = oneHotWeight(
		context.colorIndex[product.color],
		context.numColors,
		WEIGHT.color,
	);

	return tf.concat1d([price, age, category, color]);
}

function encodeUser(user, context) {
	// se possuir comprar, empila todas as compras em um unico vector
	if (user.purchases.length) {
		return tf
			.stack(user.purchases.map((p) => encodeProduct(p, context)))
			.mean(0)
			.reshape([1, context.dimentions]);
	}

	// quando o cliente nao tem compras.
	return tf
		.concat1d([
			tf.zeros([1]), // preço e ignorado,
			tf.tensor1d([
				normalize(user.age, context.minAge, context.maxAge) * WEIGHT.age,
			]), // so idade que é considerada
			tf.zeros([context.numCategories]), // categoria ignorada,
			tf.zeros([context.numColors]), // cor também é ignorada
		])
		.reshape([1, context.dimentions]);
}

function createTrainingData(context) {
	const inputs = [];
	const labels = [];

	context.users
		.filter((u) => u.purchases.length)
		.forEach((user) => {
			const userVector = encodeUser(user, context).dataSync();
			context.products.forEach((product) => {
				const productVector = encodeProduct(product, context).dataSync();
				const label = user.purchases.some((purchase) =>
					purchase.name === product.name ? 1 : 0,
				);
				// combinar usuario + products
				inputs.push([...userVector, ...productVector]);
				labels.push(label);
			});
		});

	return {
		xs: tf.tensor2d(inputs),
		ys: tf.tensor2d(labels, [labels.length, 1]),
		inputDimention: context.dimentions * 2,
	};
}

// ====================================================================
// 📌 Exemplo de como um usuário é ANTES da codificação
// ====================================================================
/*
const exampleUser = {
    id: 201,
    name: 'Rafael Souza',
    age: 27,
    purchases: [
        { id: 8, name: 'Boné Estiloso', category: 'acessórios', price: 39.99, color: 'preto' },
        { id: 9, name: 'Mochila Executiva', category: 'acessórios', price: 159.99, color: 'cinza' }
    ]
};
*/

// ====================================================================
// 📌 Após a codificação, o modelo NÃO vê nomes ou palavras.
// Ele vê um VETOR NUMÉRICO (todos normalizados entre 0–1).
// Exemplo: [preço_normalizado, idade_normalizada, cat_one_hot..., cor_one_hot...]
//
// Suponha categorias = ['acessórios', 'eletrônicos', 'vestuário']
// Suponha cores      = ['preto', 'cinza', 'azul']
//
// Para Rafael (idade 27, categoria: acessórios, cores: preto/cinza),
// o vetor poderia ficar assim:
//
// [
//   0.45,            // peso do preço normalizado
//   0.60,            // idade normalizada
//   1, 0, 0,         // one-hot de categoria (acessórios = ativo)
//   1, 0, 0          // one-hot de cores (preto e cinza ativos, azul inativo)
// ]
//
// São esses números que vão para a rede neural.
// ====================================================================

// ====================================================================
// 🧠 Configuração e treinamento da rede neural
// ====================================================================
async function configureNeuralNetAndTrain(trainData) {
	// modelo é sequencial
	const model = tf.sequential();

	// camada de entrada
	// inputShape: numero de feature por exemplo de treino (dimesoes do vetor);
	// ex: se o vetor produto + usuario = 20, entao sao 20 dimesoes;
	// units: neurônios (muitos 'olhos em busca de padrao'), com uma base tao pequena, maior o numero
	// activation: 'relu' (mantém apenas sinais positivos, ajuda a aprender padrões não linerares);

	model.add(
		tf.layers.dense({
			inputShape: [trainData.inputDimention],
			units: 128,
			activation: 'relu',
		}),
	);

	// segunda camada oculta (gerar melhor adaptação)
	// - 64 neurônios (menos que a primeira camada: inicio da compressão de informações);
	// - activations: 'relu' (extração de combinações relevantes de features)
	model.add(
		tf.layers.dense({
			units: 64,
			activation: 'relu',
		}),
	);

	// terceira camada oculta (gerar melhor adaptação)
	// - 32 neurônios (menos que a segunda camada, destilando as informações mais importantes);
	// ex: de muitos sinais, mantém apensar os padrões mais fortes;
	// - activations: 'relu' (extração de combinações relevantes de features)
	model.add(
		tf.layers.dense({
			units: 32,
			activation: 'relu',
		}),
	);

	// camada de saida
	// 1 neurônio somente porque vamos retornar apenas uma pontuação de recomendação
	// activation: 'sigmoid' comprime o resultado para o intervalo: 0 - 1
	// Exemp;o: 0.9 = recomendação forte, 0.1 = recomendação fraca
	model.add(
		tf.layers.dense({
			units: 1,
			activation: 'sigmoid',
		}),
	);

	// Compilando o modelo
	// optimizer Adam ( Adaptive Moment Estimation)
	// é um treinador pessoal moderno para redes neurais:
	// ajusta os pesos de forma eficiente e inteligente
	// aprender com historico de erros e acertos

	model.compile({
		optimizer: tf.train.adam(0.01),
		loss: 'binaryCrossentropy',
		metrics: ['accuracy'],
	});

	await model.fit(trainData.xs, trainData.ys, {
		epochs: 100, // quantas vezes o treinamento vai rodar
		batchSize: 32, // rodar de 32 em 32
		shuffle: true, // embaralhar os dados para o algoritmo nao ficar viciado
		callbacks: {
			onEpochEnd: (epoch, logs) => {
				postMessage({
					type: workerEvents.trainingLog,
					epoch: epoch,
					loss: logs.loss,
					accuracy: logs.acc,
				});
			},
		},
	});

	return model;
}

async function trainModel({ users }) {
	console.log('Training model with users:', users);

	postMessage({
		type: workerEvents.progressUpdate,
		progress: { progress: 50 },
	});

	const products = await (await fetch('/data/products.json')).json();
	const context = makeContext(products, users);

	context.productVectors = products.map((product) => {
		return {
			name: product.name,
			meta: { ...product },
			vector: encodeProduct(product, context).dataSync(),
		};
	});

	_globalCtx = context;

	const trainData = createTrainingData(context);

	_model = await configureNeuralNetAndTrain(trainData);

	postMessage({
		type: workerEvents.progressUpdate,
		progress: { progress: 100 },
	});
	postMessage({ type: workerEvents.trainingComplete });
}

/**
 * Funcao de recomendação
 * Em aplicações reais NUNCA armazene vetores em memória
 * Armazene todos os vetores em um banco de dados vetorial (postgres, neo4j ou pinecone);
 * Ex: consulte os 200 produtos mais proximo do usuario fornecedo, ai sim utiliza o model predict apenas no vetores fornecidos
 *
 * @param {*} user
 * @param {*} ctx
 * @returns
 */
function recommend(user, ctx) {
	if (!_model) return;
	// converter o usuário em vetor codificado = range: 0-1;
	// ignorar preco, idade normalizada, categoria ignoradas
	// transformar as informacoes do usuário no mesmo formatdo numero que o modelo foi treinado
	const userVector = encodeUser(user, ctx).dataSync();

	// Cria pares de entrada: para cada produto, cancatene o vetor do usuario com vetor codificado do produto
	// O modelo irá prevê o "score de compatibilidade" para cada usuário x produto (par)
	const inputs = ctx.productVectors.map(({ vector }) => {
		return [...userVector, ...vector];
	});

	// converter os pares (usuario, produto) em um unico tensor - formato: [numProduto, inputDim];
	const inputTensor = tf.tensor2d(inputs);
	// roda a rede nueral treinada em todos os pares de uma vez
	// o resultado é a pontuacao para cada produto entre 0 e 1
	// quanto maior, maior. probabilidade de compro do produto
	const predictions = _model.predict(inputTensor); // fez predição do produto
	const scores = predictions.dataSync();
	const recommendations = ctx.productVectors.map((item, index) => {
		return {
			...item.meta,
			name: item.name,
			score: scores[index], // previsao do modelo para determinado produto
		};
	});

	const sortedItems = recommendations.sort((a, b) => b.score - a.score);

	postMessage({
		type: workerEvents.recommend,
		user,
		recommendations: sortedItems,
	});
}

const handlers = {
	[workerEvents.trainModel]: trainModel,
	[workerEvents.recommend]: (d) => recommend(d.user, _globalCtx),
};

self.onmessage = (e) => {
	const { action, ...data } = e.data;
	if (handlers[action]) handlers[action](data);
};
