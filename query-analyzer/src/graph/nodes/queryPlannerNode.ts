import {
  getSystemPrompt,
  getUserPromptTemplate,
  QueryAnalysisSchema,
} from '../../prompts/v1/queryAnalyzer.ts';
import { OpenRouterService } from '../../services/open-router.service.ts';
import type { GraphState } from '../graph.ts';

export function createQueryPlannerNode(llmClient: OpenRouterService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    try {
      const systemPrompt = getSystemPrompt();
      const userPrompt = getUserPromptTemplate(state.question!);

      const { data, error } = await llmClient.generateStructured(
        userPrompt,
        systemPrompt,
        QueryAnalysisSchema,
      );

      if (error) {
        console.error('❌ Error analyzing query:', error);
        return {
          isMultiStep: false,
          error,
        };
      }

      if (data?.requiresDecomposition && !!data.subQuestions?.length) {
        console.log('🔍 Query requires decomposition into sub-questions.');
        return {
          isMultiStep: true,
          subQuestions: data.subQuestions,
          currentStep: 0,
          subQueries: [],
          subResults: [],
        };
      }

      console.log('🔍 Query does not require decomposition.');
      return {
        isMultiStep: false,
      };
    } catch (error: any) {
      console.error('❌ Error analyzing query:', error.message);
      return {
        ...state,
        isMultiStep: false,
      };
    }
  };
}
