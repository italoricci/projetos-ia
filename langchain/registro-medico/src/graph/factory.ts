import { config } from "../config.ts";
import { AppointmentService } from "../services/appointmentService.ts";
import { LLMService } from "../services/llmService.ts";
import { buildAppointmentGraph } from "./graph.ts";

export function buildGraph() {
  const llmClient = new LLMService(config);
  const appointmentService = new AppointmentService();
  return buildAppointmentGraph(llmClient, appointmentService);
}

export const graph = async () => {
  return buildGraph();
};
