import { OpenRouterService } from "../../services/open-router.service.ts";
import { Neo4jService } from "../../services/neo4j.service.ts";
import type { GraphState } from "../graph.ts";

export function createCypherGeneratorNode(
  llmClient: OpenRouterService,
  neo4jService: Neo4jService,
) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    try {
      return {
        ...state,
      };
    } catch (error: any) {
      console.error("Error generating Cypher query:", error.message);
      return {
        ...state,
        error: `Failed to generate query: ${error.message}`,
      };
    }
  };
}
