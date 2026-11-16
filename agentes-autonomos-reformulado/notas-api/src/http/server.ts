import { createServer } from "node:http";
import { JsonFileTaskStore } from "../store/task-store.js";
import { TaskService } from "../service/task-service.js";
import { createTaskHandler } from "./task-handler.js";

export function createTaskServer(
  service = new TaskService(new JsonFileTaskStore()),
) {
  return createServer(createTaskHandler(service));
}
