import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { ZodError, z } from "zod";
import { createTaskInputSchema, taskListFilterSchema } from "./domain/task.js";
import { TaskService } from "./service/task-service.js";
import { JsonFileTaskStore } from "./store/task-store.js";
import type { Task } from "./domain/task.js";

const USAGE = [
  "Usage:",
  "  notas-api create <title>",
  "  notas-api list [all|open|done]",
  "  notas-api complete <id>",
  "  notas-api remove <id>",
].join("\n");

export interface CliOutput {
  stdout(message: string): void;
  stderr(message: string): void;
}

class CliUsageError extends Error {}

const defaultOutput: CliOutput = {
  stdout: (message) => process.stdout.write(`${message}\n`),
  stderr: (message) => process.stderr.write(`${message}\n`),
};

function formatTask(task: Task): string {
  return `${task.id} [${task.status}] ${task.title}`;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof ZodError) {
    return error.issues.map((issue) => issue.message).join("; ");
  }
  return error instanceof Error ? error.message : String(error);
}

function parseId(id: string): string {
  return z.string().trim().min(1, "Task ID is required").parse(id);
}

export async function runCli(
  args: string[],
  service = new TaskService(new JsonFileTaskStore()),
  output: CliOutput = defaultOutput,
): Promise<number> {
  const [command, ...commandArgs] = args;

  try {
    switch (command) {
      case "create": {
        if (commandArgs.length === 0) {
          throw new CliUsageError(`A title is required.\n${USAGE}`);
        }
        const input = createTaskInputSchema.parse({
          title: commandArgs.join(" "),
        });
        const task = await service.create(input);
        output.stdout(`Created task: ${formatTask(task)}`);
        return 0;
      }

      case "list": {
        if (commandArgs.length > 1) {
          throw new CliUsageError(USAGE);
        }
        const filter = taskListFilterSchema.parse(commandArgs[0]);
        const tasks = await service.list(filter);
        output.stdout(
          tasks.length === 0
            ? "No tasks found."
            : tasks.map(formatTask).join("\n"),
        );
        return 0;
      }

      case "complete": {
        if (commandArgs.length !== 1) {
          throw new CliUsageError(`A task ID is required.\n${USAGE}`);
        }
        const task = await service.complete(parseId(commandArgs[0]));
        output.stdout(`Completed task: ${formatTask(task)}`);
        return 0;
      }

      case "remove": {
        if (commandArgs.length !== 1) {
          throw new CliUsageError(`A task ID is required.\n${USAGE}`);
        }
        const id = parseId(commandArgs[0]);
        await service.remove(id);
        output.stdout(`Removed task ${id}`);
        return 0;
      }

      default:
        throw new CliUsageError(USAGE);
    }
  } catch (error) {
    output.stderr(getErrorMessage(error));
    return error instanceof CliUsageError ? 2 : 1;
  }
}

function isMainModule(): boolean {
  const entryPoint = process.argv[1];
  return (
    entryPoint !== undefined &&
    import.meta.url === pathToFileURL(resolve(entryPoint)).href
  );
}

if (isMainModule()) {
  void runCli(process.argv.slice(2)).then((exitCode) => {
    process.exitCode = exitCode;
  });
}
