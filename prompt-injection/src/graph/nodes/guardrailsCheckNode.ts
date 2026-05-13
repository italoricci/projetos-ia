import { OpenRouterService } from '../../services/openrouterService.ts';
import type { GraphState } from '../state.ts';

export const createGuardrailsCheckNode = (
  openRouterService: OpenRouterService,
) => {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    try {
      const input = state.messages.at(-1)?.text || '';

      const result = await openRouterService.checkGuardrails(
        input,
        state.guardrailsEnabled,
      );

      return {
        guardrailCheck: {
          safe: result.safe,
          reason: result.reason,
          analysis: result.analysis,
          score: result.score,
        },
      };
    } catch (error) {
      console.error('Guardrails check failed:', error);
      return {
        guardrailCheck: {
          reason: 'Guardrails check failed due to an error.',
          safe: false,
        },
      };
    }
  };
};
