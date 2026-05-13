import { PromptTemplate } from '@langchain/core/prompts';
import type { GraphState } from '../state.ts';
import { prompts } from '../../config.ts';
import { AIMessage } from 'langchain';

export async function blockedNode(
  state: GraphState,
): Promise<Partial<GraphState>> {
  console.warn('🚫 User input blocked by guardrails!');

  const checkGuardrails = state.guardrailCheck;
  const analysis = checkGuardrails?.analysis
    ? `Guardrails analysis: ${checkGuardrails.analysis}`
    : 'No additional analysis provided.';

  const permissions = state.user.permissions?.join(', ') ?? 'None';
  const template = PromptTemplate.fromTemplate(prompts.blocked);
  const blockedMessage = await template.format({
    REASON: checkGuardrails?.reason || 'Unknown reason',
    ANALYSIS: analysis,
    USER_ROLE: state.user.role || 'Unknown role',
    PERMISSIONS: permissions,
  });

  return {
    messages: [new AIMessage(blockedMessage)],
  };
}
