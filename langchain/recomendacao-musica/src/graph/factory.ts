import { OpenRouterService } from '../services/open-router.service.ts';
import { config } from '../config.ts';
import { buildChatGraph } from './graph.ts';
import { createMemoryService } from '../services/memory.service.ts';
import { PreferencesService } from '../services/preferences.service.ts';

export async function buildGraph(dbPath: string = './preferences.db') {
  const llmClient = new OpenRouterService(config);
  const preferencesService = new PreferencesService(dbPath);
  const memoryService = await createMemoryService();

  const graph = buildChatGraph(llmClient, memoryService, preferencesService);

  return {
    graph,
    preferencesService,
  };
}

export const graph = async () => buildGraph();
export default graph;
