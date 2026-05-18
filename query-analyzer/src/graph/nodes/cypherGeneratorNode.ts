import {
  CypherQuerySchema,
  getSystemPrompt,
  getUserPromptTemplate,
} from '../../prompts/v1/cypherGenerator.ts';
import { SALES_CONTEXT } from '../../prompts/v1/salesContext.ts';
import { Neo4jService } from '../../services/neo4j.service.ts';
import { OpenRouterService } from '../../services/open-router.service.ts';
import type { GraphState } from '../graph.ts';

const getCurrentStepQuestion = (state: GraphState) => {
  if (
    !state.isMultiStep ||
    state.currentStep === undefined ||
    !state.subQuestions?.length
  ) {
    return null;
  }

  if (state.currentStep >= state.subQuestions.length) {
    return null;
  }

  return {
    question: state.subQuestions[state.currentStep],
    stepNumber: state.currentStep + 1,
  };
};

export function createCypherGeneratorNode(
  llmClient: OpenRouterService,
  neo4jService: Neo4jService,
) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    try {
      const schema = await neo4jService.getSchema();
      const systemPrompt = await getSystemPrompt(schema, SALES_CONTEXT);
      const stepInfo = getCurrentStepQuestion(state);
      const targetQuestion = stepInfo?.question ?? state.question;

      console.log('🔥 Target Question:', targetQuestion);

      const userPrompt = getUserPromptTemplate(targetQuestion!);

      const { data, error } = await llmClient.generateStructured(
        userPrompt,
        systemPrompt,
        CypherQuerySchema,
      );

      if (error) {
        return {
          error: `Failed to generate Chyper Query ${error}`,
        };
      }

      const query = data?.query;

      console.log('🤖 Result LLM Chyper Generator', query);

      if (state.isMultiStep && state.subQueries?.length) {
        return {
          query,
          subQueries: [...state.subQueries, query ?? ''],
        };
      }

      return {
        query,
      };
    } catch (error: any) {
      console.error('❌ Error generating Cypher query:', error.message);
      return {
        ...state,
        error: `Failed to generate query: ${error.message}`,
      };
    }
  };
}
