import FormData from "form-data";
import fs from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { createServer } from "./server.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = createServer();

await app.listen({ port: 4000, host: "0.0.0.0" });
console.log(`
╔════════════════════════════════════════╗
║   Document Q&A Pipeline Server         ║
║   Running on http://0.0.0.0:4000       ║
╚════════════════════════════════════════╝

📚 Available endpoint:
  • POST /chat  - Upload PDF and ask a question

Example usage:
  curl -X POST -F "file=@document.pdf" -F "question=Sobre o que e esse paper?" \\
    http://localhost:4000/chat
`);

// Test with default document
(async () => {
  try {
    const filename = "a-comprehensive-overview-of-large-language-models.pdf";
    const pdfPath = join(__dirname, "..", "docs", filename);
    const pdfBuffer = await fs.readFile(pdfPath);

    console.log("🧪 Testing with default document...\n");

    const formData = new FormData();
    formData.append("file", pdfBuffer, {
      filename,
      contentType: "application/pdf",
    });
    formData.append("question", "descreve o que tem nesse documento?");

    const response = await app.inject({
      method: "POST",
      url: "/chat",
      headers: formData.getHeaders(),
      payload: formData,
    });

    const result = JSON.parse(response.body);

    console.log("📝 AI Response:");
    console.log(result.answer);
    console.log("\n");
  } catch (error) {
    console.error(
      "⚠️ Could not run default test:",
      error instanceof Error ? error.message : error,
    );
  }
})();
