import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createTaskInputSchema } from "../domain/task.js";
import { JsonFileTaskStore } from "../store/task-store.js";
import {
  DuplicateTaskTitleError,
  TaskNotFoundError,
  TaskService,
} from "./task-service.js";

async function withService(
  run: (service: TaskService) => Promise<void>,
): Promise<void> {
  const directory = await mkdtemp(join(tmpdir(), "notas-api-task-service-"));
  try {
    await run(new TaskService(new JsonFileTaskStore(join(directory, "tasks.json"))));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test("service creates tasks with trimmed titles and open status", async () => {
  await withService(async (service) => {
    const task = await service.create(
      createTaskInputSchema.parse({ title: "  Prepare report  " }),
    );

    assert.match(task.id, /^[0-9a-f-]{36}$/i);
    assert.equal(task.title, "Prepare report");
    assert.equal(task.status, "open");
  });
});

test("service rejects duplicate titles ignoring case and surrounding spaces", async () => {
  await withService(async (service) => {
    await service.create(createTaskInputSchema.parse({ title: "Prepare report" }));

    await assert.rejects(
      service.create(createTaskInputSchema.parse({ title: "  PREPARE REPORT " })),
      (error: unknown) => error instanceof DuplicateTaskTitleError,
    );
  });
});

test("service lists all tasks by default and filters open and done tasks", async () => {
  await withService(async (service) => {
    const openTask = await service.create(
      createTaskInputSchema.parse({ title: "Open task" }),
    );
    const taskToComplete = await service.create(
      createTaskInputSchema.parse({ title: "Done task" }),
    );
    const doneTask = await service.complete(taskToComplete.id);

    assert.deepEqual(await service.list(), [openTask, doneTask]);
    assert.deepEqual(await service.list("open"), [openTask]);
    assert.deepEqual(await service.list("done"), [doneTask]);
  });
});

test("service completes an existing task idempotently", async () => {
  await withService(async (service) => {
    const task = await service.create(
      createTaskInputSchema.parse({ title: "Complete task" }),
    );

    const completedTask = await service.complete(task.id);
    assert.equal(completedTask.status, "done");
    assert.deepEqual(await service.complete(task.id), completedTask);
  });
});

test("service removes existing tasks and reports missing IDs", async () => {
  await withService(async (service) => {
    const task = await service.create(
      createTaskInputSchema.parse({ title: "Remove task" }),
    );

    await service.remove(task.id);
    assert.deepEqual(await service.list(), []);

    await assert.rejects(
      service.complete(task.id),
      (error: unknown) => error instanceof TaskNotFoundError,
    );
    await assert.rejects(
      service.remove(task.id),
      (error: unknown) => error instanceof TaskNotFoundError,
    );
  });
});
