# 🦙 Ollama AI Assistant

A local AI assistant powered by Ollama, enabling private and offline AI interactions without sending data to external servers.

## Features

- **Local AI Models** – Run LLMs entirely on your own hardware
- **Multiple Model Support** – Switch between different Ollama models
- **MCP Tools** – Model Context Protocol tool integrations
- **God Prompts** – Advanced system prompt configurations
- **File Uploads** – Attach files to conversations
- **Privacy First** – No data leaves your machine

## Getting Started

See [`docs/QUICK_START.md`](docs/QUICK_START.md) for setup and usage instructions.

## Requirements

- Ollama installed and running locally
- At least one Ollama model pulled (e.g., `ollama pull llama3`)

## Quick Start

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model
ollama pull llama3

# Start the assistant
npm install && npm start
```