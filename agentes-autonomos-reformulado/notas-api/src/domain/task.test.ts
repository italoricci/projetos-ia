import assert from "node:assert/strict";
import test from "node:test";
import {
  createTaskInputSchema,
  taskListFilterSchema,
  taskSchema,
  taskStatusSchema,
} from "./task.js";

test("task title rejects empty and whitespace-only values", () => {
  assert.equal(createTaskInputSchema.safeParse({ title: "" }).success, false);
  assert.equal(createTaskInputSchema.safeParse({ title: "   " }).success, false);
});

test("task title is trimmed when parsed", () => {
  assert.deepEqual(createTaskInputSchema.parse({ title: "  Buy milk  " }), {
    title: "Buy milk",
  });
});

test("task statuses accept only open and done", () => {
  assert.equal(taskStatusSchema.safeParse("open").success, true);
  assert.equal(taskStatusSchema.safeParse("done").success, true);
  assert.equal(taskStatusSchema.safeParse("closed").success, false);

  assert.equal(
    taskSchema.safeParse({
      id: "00000000-0000-4000-8000-000000000001",
      title: "Buy milk",
      status: "closed",
    }).success,
    false,
  );
});

test("task list filter supports all, open, and done and defaults to all", () => {
  assert.equal(taskListFilterSchema.parse(undefined), "all");
  assert.equal(taskListFilterSchema.parse("open"), "open");
  assert.equal(taskListFilterSchema.parse("done"), "done");
  assert.equal(taskListFilterSchema.safeParse("closed").success, false);
});
