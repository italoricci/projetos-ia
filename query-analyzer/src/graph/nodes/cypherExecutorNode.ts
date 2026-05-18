import { config } from '../../config.ts';
import { Neo4jService } from '../../services/neo4j.service.ts';
import type { GraphState } from '../graph.ts';

async function executeQuery(service: Neo4jService, query: string) {
  try {
    const valid = await service.validateQuery(query);

    if (!valid) {
      return { results: null, error: 'Query validation failed' };
    }

    const results = await service.query(query);

    console.log(`🤖 Retrieved ${results.length} results`);

    return { results, error: null };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Query execution error';

    console.error('❌ Query execution error:', message);

    return { results: null, error: message };
  }
}

function handleMultiSteps(state: GraphState, results: any[]) {
  const subResults = [...(state.subResults ?? []), results];
  const currentStep = (state.currentStep ?? 0) + 1;
  const totalSteps = state.subQuestions?.length ?? 0;
  const multiStepState = {
    dbResults: results,
    subResults,
    currentStep,
    needsCorrection: false,
  };

  console.log(`✅ Step ${multiStepState.currentStep}/${totalSteps} completed`);
  if (hasMoreStep({ ...state, ...multiStepState })) {
    console.log(`➡️  Moving to step ${currentStep}...`);
    return multiStepState;
  }

  console.log(`✅ All ${totalSteps} steps completed - synthesizing results`);
  return multiStepState;
}

function hasMoreStep(state: GraphState): boolean {
  if (
    !state.isMultiStep ||
    !state.subQuestions?.length ||
    state.currentStep == undefined
  ) {
    return false;
  }

  return state.currentStep < state.subQuestions.length;
}

export function createCypherExecutorNode(neo4jService: Neo4jService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    try {
      if (!state.query) {
        return { error: 'No query provided' };
      }

      const { results, error } = await executeQuery(neo4jService, state.query);

      if (error !== null) {
        const attempts = state.correctionAttempts ?? 0;

        if (attempts < config.maxCorrectionAttempts) {
          console.log('🔍 Will attempt to auto-correct query...');
          return {
            validationError: error,
            query: state.query,
            needsCorrection: true,
          };
        }

        return { error: 'Invalid Cypher syntax — correction failed' };
      }

      const hasSubQuestions = (state.subQuestions?.length ?? 0) > 0;
      const hasCurrentStep = state.currentStep != null;

      if (state.isMultiStep && hasSubQuestions && hasCurrentStep) {
        const multiStepState = handleMultiSteps(state, results);
        return {
          ...multiStepState,
        };
      }

      if (!hasSubQuestions) {
        return {
          dbResults: [],
          error: 'No results found',
        };
      }

      return {
        dbResults: results,
        needsCorrection: false,
      };
    } catch (error) {
      console.error(
        'Error executing Cypher query:',
        error instanceof Error ? error.message : error,
      );

      return {
        error: 'Invalid Cypher query - correction failed',
      };
    }
  };
}
