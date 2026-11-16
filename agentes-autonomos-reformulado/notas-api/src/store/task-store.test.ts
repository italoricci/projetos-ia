import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import type { Task } from "../domain/task.js";
import { JsonFileTaskStore } from "./task-store.js";

async function createTemporaryDirectory(): Promise<string> {
  return mkdtemp(join(tmpdir(), "notas-api-task-store-"));
}

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "00000000-0000-4000-8000-000000000001",
    title: "Buy milk",
    status: "open",
    ...overrides,
  };
}

test("JSON task store supports create, read, update, and delete", async () => {
  const directory = await createTemporaryDirectory();
  try {
    const store = new JsonFileTaskStore(join(directory, "tasks.json"));
    const task = makeTask();

    assert.deepEqual(await store.list(), []);
    await store.create(task);
    assert.deepEqual(await store.findById(task.id), task);
    assert.deepEqual(await store.list(), [task]);

    const completedTask = { ...task, status: "done" as const };
    assert.equal(await store.update(completedTask), true);
    assert.deepEqual(await store.findById(task.id), completedTask);

    assert.equal(await store.delete(task.id), true);
    assert.deepEqual(await store.list(), []);
    assert.equal(await store.update(task), false);
    assert.equal(await store.delete(task.id), false);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("JSON task store persists tasks across instances and finds titles case-insensitively", async () => {
  const directory = await createTemporaryDirectory();
  try {
    const filePath = join(directory, "tasks.json");
    const task = makeTask();
    await new JsonFileTaskStore(filePath).create(task);

    const reopenedStore = new JsonFileTaskStore(filePath);
    assert.deepEqual(await reopenedStore.findByTitle("  BUY MILK  "), task);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("JSON task store reports invalid JSON instead of treating it as empty", async () => {
  const directory = await createTemporaryDirectory();
  try {
    const filePath = join(directory, "tasks.json");
    await writeFile(filePath, "{", "utf8");

    await assert.rejects(
      new JsonFileTaskStore(filePath).list(),
      /contains invalid JSON/,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("JSON task store reports schema-invalid data", async () => {
  const directory = await createTemporaryDirectory();
  try {
    const filePath = join(directory, "tasks.json");
    await writeFile(filePath, JSON.stringify([{ id: "bad" }]), "utf8");

    await assert.rejects(
      new JsonFileTaskStore(filePath).list(),
      /contains invalid data/,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("JSON task store writes valid JSON", async () => {
  const directory = await createTemporaryDirectory();
  try {
    const filePath = join(directory, "tasks.json");
    const task = makeTask();
    await new JsonFileTaskStore(filePath).create(task);

    assert.deepEqual(JSON.parse(await readFile(filePath, "utf8")), [task]);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
