import type { IncomingMessage, ServerResponse } from "node:http";
import { ZodError } from "zod";
import { createTaskInputSchema, taskListFilterSchema } from "../domain/task.js";
import {
  DuplicateTaskTitleError,
  TaskNotFoundError,
  type TaskService,
} from "../service/task-service.js";

const MAX_BODY_BYTES = 1024 * 1024;

class InvalidJsonBodyError extends Error {}
class RequestBodyTooLargeError extends Error {}

function sendJson(
  response: ServerResponse,
  statusCode: number,
  body: unknown,
): void {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(body));
}

function sendError(response: ServerResponse, error: unknown): void {
  if (response.destroyed) {
    return;
  }

  if (error instanceof ZodError) {
    sendJson(response, 400, {
      error: {
        code: "validation_error",
        message: "Request validation failed",
        details: error.issues,
      },
    });
    return;
  }

  if (error instanceof InvalidJsonBodyError) {
    sendJson(response, 400, {
      error: { code: "invalid_json", message: "Request body must be valid JSON" },
    });
    return;
  }

  if (error instanceof RequestBodyTooLargeError) {
    sendJson(response, 413, {
      error: { code: "payload_too_large", message: "Request body is too large" },
    });
    return;
  }

  if (error instanceof DuplicateTaskTitleError) {
    sendJson(response, 409, {
      error: { code: "duplicate_task_title", message: error.message },
    });
    return;
  }

  if (error instanceof TaskNotFoundError) {
    sendJson(response, 404, {
      error: { code: "task_not_found", message: error.message },
    });
    return;
  }

  console.error("Unhandled task API error:", error);
  sendJson(response, 500, {
    error: { code: "internal_error", message: "Internal server error" },
  });
}

async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  const chunks: string[] = [];
  let totalBytes = 0;

  for await (const chunk of request) {
    const text = typeof chunk === "string" ? chunk : Buffer.from(chunk).toString("utf8");
    totalBytes += Buffer.byteLength(text);
    if (totalBytes > MAX_BODY_BYTES) {
      request.resume();
      throw new RequestBodyTooLargeError();
    }

    chunks.push(text);
  }

  try {
    return JSON.parse(chunks.join(""));
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new InvalidJsonBodyError();
    }

    throw error;
  }
}

async function dispatch(
  request: IncomingMessage,
  response: ServerResponse,
  service: TaskService,
): Promise<void> {
  const url = new URL(request.url ?? "/", "http://localhost");

  if (request.method === "POST" && url.pathname === "/tasks") {
    const input = createTaskInputSchema.parse(await readJsonBody(request));
    const task = await service.create(input);
    sendJson(response, 201, task);
    return;
  }

  if (request.method === "GET" && url.pathname === "/tasks") {
    const filter = taskListFilterSchema.parse(
      url.searchParams.get("status") ?? undefined,
    );
    sendJson(response, 200, await service.list(filter));
    return;
  }

  const completeMatch = /^\/tasks\/([^/]+)\/complete$/.exec(url.pathname);
  if (request.method === "PATCH" && completeMatch) {
    sendJson(response, 200, await service.complete(completeMatch[1]));
    return;
  }

  const deleteMatch = /^\/tasks\/([^/]+)$/.exec(url.pathname);
  if (request.method === "DELETE" && deleteMatch) {
    await service.remove(deleteMatch[1]);
    response.writeHead(204);
    response.end();
    return;
  }

  sendJson(response, 404, {
    error: { code: "route_not_found", message: "Route not found" },
  });
}

export function createTaskHandler(
  service: TaskService,
): (request: IncomingMessage, response: ServerResponse) => void {
  return (request, response) => {
    void dispatch(request, response, service).catch((error: unknown) => {
      sendError(response, error);
    });
  };
}
