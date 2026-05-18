import { AIMessage } from 'langchain';
import {
  AnalyticalResponseSchema,
  getErrorResponsePrompt,
  getMultiStepSynthesisPrompt,
  getNoResultsPrompt,
  getSystemPrompt,
  getUserPromptTemplate,
} from '../../prompts/v1/analyticalResponse.ts';
import { OpenRouterService } from '../../services/open-router.service.ts';
import type { GraphState } from '../graph.ts';

async function handleErrorResponse(
  state: GraphState,
  _llmClient: OpenRouterService,
): Promise<Partial<GraphState>> {
  const systemPrompt = getSystemPrompt();
  const userPrompt = getErrorResponsePrompt(state.error!, state.question);

  const { data, error } = await _llmClient.generateStructured(
    userPrompt,
    systemPrompt,
    AnalyticalResponseSchema,
  );

  if (error) {
    console.error('Handling error response, state.error=', state.error);
    return {
      messages: [new AIMessage(`An error ocurred: ${error}`)],
      error,
      followUpQuestions: [],
      answer: `An error ocurred ${error}`,
    };
  }
  return {
    messages: [new AIMessage(data?.answer!)],
    answer: data?.answer,
    followUpQuestions: data?.followUpQuestions,
  };
}
async function handleSuccessResponse(
  state: GraphState,
  _llmClient: OpenRouterService,
): Promise<Partial<GraphState>> {
  const systemPrompt = getSystemPrompt();
  let _userPrompt: string;
  const multiplosSteps =
    state.isMultiStep &&
    state.subResults?.length &&
    state.subQueries?.length &&
    state.subQuestions?.length;

  if (multiplosSteps) {
    console.log(`✅ Synthesizing ${state.subResults?.length} step results....`);
    const stepsData = state.subResults?.map((result, index) => ({
      stepNumber: index + 1,
      question: state.subQuestions![index],
      query: state.subQueries![index],
      results: JSON.stringify(result),
    }));
    _userPrompt = getMultiStepSynthesisPrompt(state.question!, stepsData!);
  } else {
    _userPrompt = getUserPromptTemplate(
      state.question!,
      state.query!,
      JSON.stringify(state.dbResults),
    );
  }

  const { data, error } = await _llmClient.generateStructured(
    _userPrompt,
    systemPrompt,
    AnalyticalResponseSchema,
  );

  if (error) {
    console.error('❌ Error generated analytical response');
    return {
      error: `Response generation failed ${error}`,
    };
  }

  console.log(`✅ Generated analytical response`);

  return {
    messages: [new AIMessage(data?.answer!)],
    answer: data?.answer,
    followUpQuestions: data?.followUpQuestions,
  };
}

async function handleNoResultsResponse(
  state: GraphState,
  llmClient: OpenRouterService,
): Promise<GraphState> {
  console.log('💬 Generating no-results response...');

  const systemPrompt = getSystemPrompt();
  const userPrompt = getNoResultsPrompt(
    state.question ?? 'your query',
    state.query ?? 'N/A',
  );

  const { data, error } = await llmClient.generateStructured(
    userPrompt,
    systemPrompt,
    AnalyticalResponseSchema,
  );

  if (data) {
    return {
      ...state,
      messages: [...state.messages, new AIMessage(data.answer)],
      answer: data.answer,
      followUpQuestions: data.followUpQuestions,
    };
  }

  const noResultsMessage = 'No data found matching your query.';
  return {
    ...state,
    messages: [...state.messages, new AIMessage(noResultsMessage)],
    error,
    answer: noResultsMessage,
    followUpQuestions: [],
  };
}

export function createAnalyticalResponseNode(_llmClient: OpenRouterService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    try {
      if (state.error) {
        return await handleErrorResponse(state, _llmClient);
      }
      if (!state.dbResults?.length) {
        return await handleNoResultsResponse(state, _llmClient);
      }
      return await handleSuccessResponse(state, _llmClient);
    } catch (error: any) {
      console.error('Error generating analytical response:', error.message);
      return {
        ...state,
        error: `Response generation failed: ${error.message}`,
      };
    }
  };
}
