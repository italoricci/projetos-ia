import type { GraphState } from '../graph.ts';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}

function extractQuestion(state: GraphState): string | null {
  const text = state.messages?.at(-1)?.text;

  if (typeof text !== 'string') {
    return null;
  }

  const question = text.trim();
  return question.length > 0 ? question : null;
}

export function createExtractQuestionNode() {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    try {
      if (!state.messages?.length) {
        console.error('❌ No messages in state');
        return {
          error: 'No messages provided',
        };
      }

      const question = extractQuestion(state);

      if (!question) {
        console.error('❌ Extracted question is empty');
        return {
          error: 'No valid question found in messages',
        };
      }

      console.log(`📝 Extracted question: "${question}"`);

      return {
        question,
        error: undefined,
      };
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error('❌ Error extracting question:', message);
      return {
        error: `Failed to extract question: ${message}`,
      };
    }
  };
}
