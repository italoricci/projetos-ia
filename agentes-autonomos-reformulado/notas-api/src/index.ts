import { createTaskServer } from "./http/server.js";

const server = createTaskServer();

server.on("error", (error) => {
  console.error("Unable to start task API server:", error);
  process.exitCode = 1;
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Task API listening at http://localhost:3000");
});
