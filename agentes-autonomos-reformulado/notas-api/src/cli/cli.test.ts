import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { JsonFileTaskStore } from "../store/task-store.js";
import { TaskService } from "../service/task-service.js";
import { runCli, type CliOutput } from "../cli.js";

function createOutput(): {
  output: CliOutput;
  stdout: string[];
  stderr: string[];
} {
  const stdout: string[] = [];
  const stderr: string[] = [];
  return {
    output: {
      stdout: (message) => stdout.push(message),
      stderr: (message) => stderr.push(message),
    },
    stdout,
    stderr,
  };
}

async function withStore(
  run: (filePath: string) => Promise<void>,
): Promise<void> {
  const directory = await mkdtemp(join(tmpdir(), "notas-api-cli-"));
  try {
    await run(join(directory, "tasks.json"));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

function createService(filePath: string): TaskService {
  return new TaskService(new JsonFileTaskStore(filePath));
}

test("CLI persists create and list results across separate invocations", async () => {
  await withStore(async (filePath) => {
    const createResult = createOutput();
    assert.equal(
      await runCli(
        ["create", "  Write", "documentation  "],
        createService(filePath),
        createResult.output,
      ),
      0,
    );
    assert.match(createResult.stdout[0], /\[open\] Write documentation$/);

    const listResult = createOutput();
    assert.equal(
      await runCli(["list"], createService(filePath), listResult.output),
      0,
    );
    assert.match(listResult.stdout[0], /\[open\] Write documentation$/);
    assert.deepEqual(listResult.stderr, []);

    const doneResult = createOutput();
    assert.equal(
      await runCli(
        ["list", "done"],
        createService(filePath),
        doneResult.output,
      ),
      0,
    );
    assert.equal(doneResult.stdout[0], "No tasks found.");
  });
});

test("CLI completes and removes tasks by ID", async () => {
  await withStore(async (filePath) => {
    const createResult = createOutput();
    assert.equal(
      await runCli(
        ["create", "Finish release"],
        createService(filePath),
        createResult.output,
      ),
      0,
    );
    const id = createResult.stdout[0].match(/[0-9a-f-]{36}/i)?.[0];
    assert.ok(id);

    const completeResult = createOutput();
    assert.equal(
      await runCli(
        ["complete", id],
        createService(filePath),
        completeResult.output,
      ),
      0,
    );
    assert.match(completeResult.stdout[0], /\[done\] Finish release$/);

    const removeResult = createOutput();
    assert.equal(
      await runCli(
        ["remove", id],
        createService(filePath),
        removeResult.output,
      ),
      0,
    );
    assert.match(removeResult.stdout[0], new RegExp(`^Removed task ${id}$`));
  });
});

test("CLI reports invalid arguments and domain errors with nonzero exit codes", async () => {
  await withStore(async (filePath) => {
    const invalidTitle = createOutput();
    assert.equal(
      await runCli(["create", "  "], createService(filePath), invalidTitle.output),
      1,
    );
    assert.match(invalidTitle.stderr[0], /Too small/);

    const invalidFilter = createOutput();
    assert.equal(
      await runCli(
        ["list", "closed"],
        createService(filePath),
        invalidFilter.output,
      ),
      1,
    );
    assert.notEqual(invalidFilter.stderr[0], "");

    const missingCommand = createOutput();
    assert.equal(await runCli([], createService(filePath), missingCommand.output), 2);
    assert.match(missingCommand.stderr[0], /Usage:/);

    const duplicateTitle = createOutput();
    await runCli(
      ["create", "Release"],
      createService(filePath),
      duplicateTitle.output,
    );
    assert.equal(
      await runCli(
        ["create", " release "],
        createService(filePath),
        duplicateTitle.output,
      ),
      1,
    );
    assert.match(duplicateTitle.stderr[0], /already exists/);

    const missingTask = createOutput();
    assert.equal(
      await runCli(
        ["complete", "missing-id"],
        createService(filePath),
        missingTask.output,
      ),
      1,
    );
    assert.match(missingTask.stderr[0], /was not found/);
  });
});
