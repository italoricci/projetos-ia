import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer, type Server } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { JsonFileTaskStore } from "../store/task-store.js";
import { TaskService } from "../service/task-service.js";
import { createTaskHandler } from "./task-handler.js";

async function withServer(
  run: (baseUrl: string) => Promise<void>,
): Promise<void> {
  const directory = await mkdtemp(join(tmpdir(), "notas-api-http-"));
  const service = new TaskService(
    new JsonFileTaskStore(join(directory, "tasks.json")),
  );
  const server: Server = createServer(createTaskHandler(service));

  try {
    await new Promise<void>((resolve, reject) => {
      server.once("error", reject);
      server.listen(0, "127.0.0.1", () => {
        server.off("error", reject);
        resolve();
      });
    });

    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Unable to determine the HTTP server address");
    }

    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    if (server.listening) {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }
    await rm(directory, { recursive: true, force: true });
  }
}

test("HTTP API creates, lists, completes, and removes tasks", async () => {
  await withServer(async (baseUrl) => {
    const createdResponse = await fetch(`${baseUrl}/tasks`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "  Prepare report  " }),
    });
    assert.equal(createdResponse.status, 201);
    const createdTask = await createdResponse.json();
    assert.equal(createdTask.title, "Prepare report");
    assert.equal(createdTask.status, "open");

    const listResponse = await fetch(`${baseUrl}/tasks`);
    assert.equal(listResponse.status, 200);
    assert.deepEqual(await listResponse.json(), [createdTask]);

    const completeResponse = await fetch(
      `${baseUrl}/tasks/${createdTask.id}/complete`,
      { method: "PATCH" },
    );
    assert.equal(completeResponse.status, 200);
    const completedTask = await completeResponse.json();
    assert.equal(completedTask.status, "done");

    const filteredResponse = await fetch(`${baseUrl}/tasks?status=done`);
    assert.deepEqual(await filteredResponse.json(), [completedTask]);

    const deleteResponse = await fetch(`${baseUrl}/tasks/${createdTask.id}`, {
      method: "DELETE",
    });
    assert.equal(deleteResponse.status, 204);
    assert.equal(await deleteResponse.text(), "");
  });
});

test("HTTP API validates request bodies and list filters", async () => {
  await withServer(async (baseUrl) => {
    const emptyTitleResponse = await fetch(`${baseUrl}/tasks`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "   " }),
    });
    assert.equal(emptyTitleResponse.status, 400);
    assert.equal((await emptyTitleResponse.json()).error.code, "validation_error");

    const invalidJsonResponse = await fetch(`${baseUrl}/tasks`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{",
    });
    assert.equal(invalidJsonResponse.status, 400);
    assert.equal((await invalidJsonResponse.json()).error.code, "invalid_json");

    const invalidFilterResponse = await fetch(`${baseUrl}/tasks?status=closed`);
    assert.equal(invalidFilterResponse.status, 400);
    assert.equal(
      (await invalidFilterResponse.json()).error.code,
      "validation_error",
    );
  });
});

test("HTTP API reports duplicate titles and missing tasks", async () => {
  await withServer(async (baseUrl) => {
    const createTask = (title: string) =>
      fetch(`${baseUrl}/tasks`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title }),
      });

    const createdResponse = await createTask("Prepare report");
    const task = await createdResponse.json();
    const duplicateResponse = await createTask("  PREPARE REPORT ");
    assert.equal(duplicateResponse.status, 409);
    assert.equal(
      (await duplicateResponse.json()).error.code,
      "duplicate_task_title",
    );

    const missingCompleteResponse = await fetch(
      `${baseUrl}/tasks/not-present/complete`,
      { method: "PATCH" },
    );
    assert.equal(missingCompleteResponse.status, 404);
    assert.equal(
      (await missingCompleteResponse.json()).error.code,
      "task_not_found",
    );

    const missingDeleteResponse = await fetch(`${baseUrl}/tasks/not-present`, {
      method: "DELETE",
    });
    assert.equal(missingDeleteResponse.status, 404);

    const unknownRouteResponse = await fetch(`${baseUrl}/unknown`);
    assert.equal(unknownRouteResponse.status, 404);

    const listResponse = await fetch(`${baseUrl}/tasks?status=all`);
    assert.deepEqual(await listResponse.json(), [task]);
  });
});
