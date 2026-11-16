import { z } from "zod";

export const taskStatusSchema = z.enum(["open", "done"]);
export type TaskStatus = z.infer<typeof taskStatusSchema>;

export const taskListFilterSchema = z.enum(["all", "open", "done"]).default("all");
export type TaskListFilter = z.infer<typeof taskListFilterSchema>;

export const taskTitleSchema = z.string().trim().min(1);

export const createTaskInputSchema = z.object({
  title: taskTitleSchema,
});
export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;

export const taskSchema = z.object({
  id: z.uuid(),
  title: taskTitleSchema,
  status: taskStatusSchema,
});
export type Task = z.infer<typeof taskSchema>;
