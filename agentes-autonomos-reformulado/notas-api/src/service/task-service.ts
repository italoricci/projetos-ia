import { randomUUID } from "node:crypto";
import type {
  CreateTaskInput,
  Task,
  TaskListFilter,
} from "../domain/task.js";
import type { TaskStore } from "../store/task-store.js";

export class DuplicateTaskTitleError extends Error {
  constructor(readonly title: string) {
    super(`A task with title "${title}" already exists`);
    this.name = "DuplicateTaskTitleError";
  }
}

export class TaskNotFoundError extends Error {
  constructor(readonly id: string) {
    super(`Task with ID "${id}" was not found`);
    this.name = "TaskNotFoundError";
  }
}

export class TaskService {
  constructor(private readonly store: TaskStore) {}

  async create(input: CreateTaskInput): Promise<Task> {
    const existingTask = await this.store.findByTitle(input.title);
    if (existingTask) {
      throw new DuplicateTaskTitleError(input.title);
    }

    const task: Task = {
      id: randomUUID(),
      title: input.title,
      status: "open",
    };
    await this.store.create(task);
    return task;
  }

  async list(filter: TaskListFilter = "all"): Promise<Task[]> {
    const tasks = await this.store.list();
    return filter === "all"
      ? tasks
      : tasks.filter((task) => task.status === filter);
  }

  async complete(id: string): Promise<Task> {
    const task = await this.store.findById(id);
    if (!task) {
      throw new TaskNotFoundError(id);
    }

    if (task.status === "done") {
      return task;
    }

    const completedTask: Task = { ...task, status: "done" };
    if (!(await this.store.update(completedTask))) {
      throw new TaskNotFoundError(id);
    }

    return completedTask;
  }

  async remove(id: string): Promise<void> {
    if (!(await this.store.delete(id))) {
      throw new TaskNotFoundError(id);
    }
  }
}
