import {
  CypherCorrectionSchema,
  getSystemPrompt,
  getUserPromptTemplate,
} from '../../prompts/v1/cypherCorrection.ts';
import { Neo4jService } from '../../services/neo4j.service.ts';
import { OpenRouterService } from '../../services/open-router.service.ts';
import type { GraphState } from '../graph.ts';

export function createCypherCorrectionNode(
  llmClient: OpenRouterService,
  neo4jService: Neo4jService,
) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    try {
      console.log(`Trying correction query!`);
      const schema = await neo4jService.getSchema();
      const systemPrompt = getSystemPrompt(schema);
      const userPrompt = getUserPromptTemplate(
        state.query!,
        state.validationError!,
        state.question,
      );

      const { data, error } = await llmClient.generateStructured(
        userPrompt,
        systemPrompt,
        CypherCorrectionSchema,
      );

      if (error) {
        return {
          error: `Query correction failed: ${error ?? 'Unknown error'}`,
        };
      }

      console.log(`✅ Query corrected: ${data?.explanation}`);

      return {
        query: data?.correctedQuery,
        originalQuery: state.originalQuery ?? state.query,
        correctionAttempts: (state.correctionAttempts ?? 0) + 1,
        validationError: error,
        needsCorrection: false,
      };
    } catch (error: any) {
      console.error('Error correcting query:', error.message);
      return {
        ...state,
        error: `Query correction failed: ${error.message}`,
      };
    }
  };
}
