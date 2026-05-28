# IAGenerate/ciphersuite-mcp

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that provides AES-256-CBC encryption and decryption tools, resources describing the algorithm and decryption flow, and ready-to-use prompts for both operations.

---

## What it does

| Capability  | Name                     | Description                                                                       |
| ----------- | ------------------------ | --------------------------------------------------------------------------------- |
| 🔧 Tool     | `encrypt_message`        | Encrypts any plain-text message with a passphrase                                 |
| 🔧 Tool     | `decrypt_message`        | Decrypts a previously encrypted message with the same passphrase                  |
| 📄 Resource | `encryption://info`      | Returns details about the algorithm, key derivation, and encrypted output format  |
| 📄 Resource | `decryption://info`      | Returns details about decryption requirements and accepted encrypted input format |
| 💬 Prompt   | `encrypt_message_prompt` | Pre-built prompt that asks the agent to encrypt a message                         |
| 💬 Prompt   | `decrypt_message_prompt` | Pre-built prompt that asks the agent to decrypt a message                         |

## How encryption works

- **Algorithm**: AES-256-CBC
- **Key derivation**: `scrypt(passphrase, fixedSalt, 32)` — you pass any passphrase string; the server derives a strong 32-byte key automatically
- **Encrypted output format**: `<IV in hex>:<ciphertext in hex>`
- **IV**: a fresh random 16-byte IV is generated on every encryption call, so the same message encrypted twice produces different output
- **Decryption requirement**: the exact same passphrase used for encryption must be provided during decryption

---

## Prerequisites

- **Node.js v24+** (see `engines` in `package.json`)

---

## Installation

```bash
npm install
```

No build step is needed — the server runs TypeScript directly via Node.js native TypeScript support.

---

## Using in VS Code

### 1. Add the MCP server configuration

Create or open `.vscode/mcp.json` in your workspace and add:

```json
{
  "servers": {
    "ciphersuite-mcp": {
      "command": "node",
      "args": [
        "--experimental-strip-types",
        "ABSOLUTE_PATH_TO_PROJECT/src/index.ts"
      ]
    }
  }
}
```

> **Tip:** You can also add this server to your user-level MCP config at `~/.vscode/mcp.json` to make it available in every workspace.

### 2. Reload VS Code

Open the Command Palette (`Cmd+Shift+P`) and run **Developer: Reload Window** or restart VS Code.

### 3. Use it in Copilot Chat

Try commands like:

```text
Encrypt the message "Hello, World!" using the passphrase "my-secret-key"
```

```text
Decrypt this message: a3f1...:<ciphertext> using the passphrase "my-secret-key"
```

```text
Show me the encryption://info resource
```

```text
Show me the decryption://info resource
```

```text
Use the encrypt_message_prompt prompt with message "hello" and passphrase "123456"
```

The agent will call the appropriate tool, resource, or prompt depending on the request.

---

## Running the MCP Inspector

The MCP Inspector lets you explore and test all tools, resources, and prompts interactively in a browser UI:

```bash
npm run mcp:inspect
```

This opens the inspector and connects it to the running server.

---

## Running tests

```bash
npm test
```

Watch mode:

```bash
npm run test:dev
```

The test suite covers:

- Encrypting a message
- Decrypting a message with the correct passphrase
- Listing the `encryption://info` resource
- Listing the `decryption://info` resource
- Listing available prompts
- Fetching `encrypt_message_prompt`
- Fetching `decrypt_message_prompt`
- Validating prompt argument interpolation

---

## Project structure

```text
src/
  index.ts                  # Entry point - connects the server to stdio transport
  mcp.ts                    # Creates the MCP server and registers all modules
  service.ts                # Encryption and decryption business logic

  shared/
    utility.tss             # Shared Helpers, error handling and schemas

  tools/
    encrypt.tool.ts
    decrypt.tool.ts
    index.ts                # Registers all tools

  resources/
    encrypt.resource.ts
    decrypt.resource.ts
    index.ts                # Registers all resources

  prompts/
    encrypt.prompt.ts
    decrypt.prompt.ts
    index.ts                # Registers all prompts

tests/
  helpers.ts
  mcp.test.ts
```

---

## Available scripts

| Script                | Description                                 |
| --------------------- | ------------------------------------------- |
| `npm start`           | Start the server                            |
| `npm run dev`         | Start with file-watch and Node.js inspector |
| `npm test`            | Run all tests                               |
| `npm run test:dev`    | Run tests in watch mode                     |
| `npm run mcp:inspect` | Open the MCP Inspector UI                   |

---

## Notes

- This project uses ESM imports, so relative imports should include explicit file extensions.
- The stdio bootstrap lives in `src/index.ts`.
- The MCP definitions live in modular files and are assembled in `src/mcp.ts`.
- Prompts, tools, and resources are registered separately to keep the server easier to maintain and test.
