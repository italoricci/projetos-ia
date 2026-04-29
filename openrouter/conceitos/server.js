require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { default: fetch } = require('node-fetch');
const path = require('path');
const livereload = require('livereload');

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(__dirname);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/chat', async (req, res) => {
	console.log('📤 > OpenRouter API called');
	console.log('📋 Model:', req.body.model);
	console.log('💬 Messages:', req.body.messages.length);
	console.log('🔑 Key loaded:', !!process.env.OPENROUTER_KEY);

	try {
		const response = await fetch(
			'https://openrouter.ai/api/v1/chat/completions',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${process.env.OPENROUTER_KEY}`,
					'HTTP-Referer': 'http://localhost:3000',
					'X-Title': 'OpenRouter Chat',
				},
				body: JSON.stringify(req.body),
			},
		);

		console.log('📥 < Status:', response.status);
		console.log(
			'📋 Headers:',
			[...response.headers.entries()].map(([k, v]) => `${k}: ${v}`).join('\\n'),
		);

		const contentType = response.headers.get('content-type') || 'text/plain';
		res.writeHead(response.status, {
			'Content-Type': contentType,
			'Cache-Control': response.headers.get('cache-control') || 'no-cache',
			Connection: 'keep-alive',
		});

		response.body.pipe(res);

		let total = 0;
		response.body.on('data', (chunk) => {
			total += chunk.length;
			if (total % 2048 === 0)
				console.log(`📊 Stream: ${Math.round(total / 1024)}KB`);
		});
		response.body.on('end', () => console.log('✅ Complete:', total, 'bytes'));
		response.body.on('error', (err) => console.error('Stream err:', err));
	} catch (error) {
		console.error('💥 Error:', error.message);
		res.status(500).json({ error: error.message });
	}
});

app.listen(PORT, () => {
	console.log(`🚀 Server @ http://localhost:${PORT}`);
	console.log('📱 Open localhost:3000');
	console.log('🔄 Live reload ON | Logs aqui!');
});
