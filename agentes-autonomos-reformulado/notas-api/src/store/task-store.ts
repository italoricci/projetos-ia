import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { z } from "zod";
import { taskSchema, type Task } from "../domain/task.js";

export interface TaskStore {
  list(): Promise<Task[]>;
  findById(id: string): Promise<Task | undefined>;
  findByTitle(title: string): Promise<Task | undefined>;
  create(task: Task): Promise<void>;
  update(task: Task): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}

function hasErrorCode(error: unknown, code: string): boolean {
  return error instanceof Error && "code" in error && error.code === code;
}

function normalizeTitle(title: string): string {
  return title.trim().toLowerCase();
}

export class JsonFileTaskStore implements TaskStore {
  constructor(
    private readonly filePath = resolve(process.cwd(), ".data/tasks.json"),
  ) {}

  async list(): Promise<Task[]> {
    return this.readTasks();
  }

  async findById(id: string): Promise<Task | undefined> {
    return (await this.readTasks()).find((task) => task.id === id);
  }

  async findByTitle(title: string): Promise<Task | undefined> {
    const normalizedTitle = normalizeTitle(title);
    return (await this.readTasks()).find(
      (task) => normalizeTitle(task.title) === normalizedTitle,
    );
  }

  async create(task: Task): Promise<void> {
    const tasks = await this.readTasks();
    if (tasks.some((existingTask) => existingTask.id === task.id)) {
      throw new Error(`Task with ID "${task.id}" already exists`);
    }

    await this.writeTasks([...tasks, task]);
  }

  async update(task: Task): Promise<boolean> {
    const tasks = await this.readTasks();
    const index = tasks.findIndex((existingTask) => existingTask.id === task.id);
    if (index === -1) {
      return false;
    }

    tasks[index] = task;
    await this.writeTasks(tasks);
    return true;
  }

  async delete(id: string): Promise<boolean> {
    const tasks = await this.readTasks();
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) {
      return false;
    }

    tasks.splice(index, 1);
    await this.writeTasks(tasks);
    return true;
  }

  private async readTasks(): Promise<Task[]> {
    let serializedTasks: string;
    try {
      serializedTasks = await readFile(this.filePath, "utf8");
    } catch (error) {
      if (hasErrorCode(error, "ENOENT")) {
        return [];
      }

      throw new Error(`Unable to read task store at "${this.filePath}"`, {
        cause: error,
      });
    }

    let data: unknown;
    try {
      data = JSON.parse(serializedTasks);
    } catch (error) {
      throw new Error(`Task store at "${this.filePath}" contains invalid JSON`, {
        cause: error,
      });
    }

    const parsedTasks = z.array(taskSchema).safeParse(data);
    if (!parsedTasks.success) {
      throw new Error(`Task store at "${this.filePath}" contains invalid data`, {
        cause: parsedTasks.error,
      });
    }

    return parsedTasks.data;
  }

  private async writeTasks(tasks: Task[]): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });

    const temporaryPath = `${this.filePath}.${randomUUID()}.tmp`;
    try {
      await writeFile(temporaryPath, `${JSON.stringify(tasks, null, 2)}\n`, {
        encoding: "utf8",
        flag: "wx",
      });
      await rename(temporaryPath, this.filePath);
    } catch (error) {
      try {
        await unlink(temporaryPath);
      } catch (cleanupError) {
        if (!hasErrorCode(cleanupError, "ENOENT")) {
          throw new AggregateError(
            [error, cleanupError],
            `Unable to write task store or clean up "${temporaryPath}"`,
          );
        }
      }

      throw new Error(`Unable to write task store at "${this.filePath}"`, {
        cause: error,
      });
    }
  }
}
