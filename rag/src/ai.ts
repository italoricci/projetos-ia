import { type Neo4jVectorStore } from '@langchain/community/vectorstores/neo4j_vector';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { ChatOpenAI } from '@langchain/openai';

type DebugLog = (...message: unknown[]) => void;

type params = {
	debugLog: DebugLog;
	vectorStore: Neo4jVectorStore;
	nlbpModel: ChatOpenAI;
	promptConfig: any;
	templateText: string;
	topK: number;
};

interface ChainState {
	question: string;
	context?: string;
	topScore?: number;
	error?: string;
	answer?: string;
}

export class AI {
	private params: params;

	constructor(params: params) {
		this.params = params;
	}

	async retrieveVectorSearchSimilitary(input: ChainState): Promise<ChainState> {
		this.params.debugLog('🔍 Buscando no vector do Neo4J...\n');
		const vectorResults =
			await this.params.vectorStore.similaritySearchWithScore(
				input.question,
				this.params.topK,
			);

		if (!vectorResults.length) {
			this.params.debugLog(
				'⚠️ Nenhum resultado encontrado para a pergunta:',
				input.question,
			);
			return {
				...input,
				error:
					'Desculpe, não encontrei informações relevantes relacionado a pergunta.',
			};
		}
		const topScore = vectorResults[0]![1];
		this.params.debugLog(
			`✅ Encontrados ${vectorResults.length} resultados. Top score: ${(topScore * 100).toFixed(2)}%\n`,
		);

		const contexts = vectorResults
			.filter(([_, score]) => score > 0.5) // filtra somente quem tem mais de 50% de similaridade
			.map(([doc]) => doc.pageContent)
			.join('\n---\n');

		this.params.debugLog(
			'🚀 Fim da busca por similaridade. Contexto estabelecido\n',
		);

		return {
			...input,
			context: contexts,
			topScore,
		};
	}

	async generateResponse(input: ChainState): Promise<ChainState> {
		if (input.error) return input; // Se já tem um erro, não tenta gerar resposta
		this.params.debugLog('🤖 Gerando resposta com o modelo de linguagem...\n');

		const responsePrompt = ChatPromptTemplate.fromTemplate(
			this.params.templateText,
		);

		const responseChain = responsePrompt
			.pipe(this.params.nlbpModel)
			.pipe(new StringOutputParser());

		const response = await responseChain.invoke({
			role: this.params.promptConfig.role,
			task: this.params.promptConfig.task,
			tone: this.params.promptConfig.tone,
			language: this.params.promptConfig.language,
			format: this.params.promptConfig.format,
			constraints: this.params.promptConfig.constraints,
			instructions: this.params.promptConfig.instructions
				.map(
					(instruction: string, index: number) =>
						`${index + 1}. ${instruction}`,
				)
				.join('\n'),
			context: input.context,
			question: input.question,
		});

		this.params.debugLog('✅ Resposta gerada com sucesso!\n');

		return {
			...input,
			answer: response,
		};
	}

	async answerQuesion(question: string): Promise<ChainState> {
		const chain = RunnableSequence.from([
			this.retrieveVectorSearchSimilitary.bind(this), // javascript depende do contexto de execução, então é necessário usar bind para garantir que o this seja o correto
			this.generateResponse.bind(this),
		]);

		const result = await chain.invoke({ question });
		this.params.debugLog('🎯 Resposta final:\n', result.answer, '\n');
		return result;
	}
}
