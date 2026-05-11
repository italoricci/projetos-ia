import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres';
import { PostgresStore } from '@langchain/langgraph-checkpoint-postgres/store';
import { config } from '../config.ts';

export interface MemoryService {
  checkpointer: PostgresSaver;
  store: PostgresStore;
}

export async function createMemoryService(): Promise<MemoryService> {
  const dbURI = config.memory.dbUri;
  const checkpointer = PostgresSaver.fromConnString(dbURI);
  const store = PostgresStore.fromConnString(dbURI);

  await Promise.all([checkpointer.setup(), store.setup()]);
  console.log('✅ Memoria inicializada com PostgreSQL');
  return { checkpointer, store };
}
