# Quick Start Guide

Get up and running with the Multi-Agent System in 5 minutes.

## Prerequisites

- GitHub account with a Personal Access Token
- Node.js 18+ installed
- Git installed
- A project you want to enhance

## 5-Minute Setup

### 1. Get the System

```bash
# Clone the repository
git clone https://github.com/21leahcimhtiek-oss/multi-agent-system.git

# Or download directly
curl -L https://github.com/21leahcimhtiek-oss/multi-agent-system/archive/refs/heads/main.tar.gz | tar xz
```

### 2. Run the Installer

```bash
# Navigate to your project
cd /path/to/your/project

# Run the installer
/path/to/multi-agent-system/agents/install.sh .
```

### 3. Configure Authentication

```bash
# Copy the example file
cp .env.example .env

# Edit with your credentials
nano .env
```

Minimum required:
```
GITHUB_TOKEN=ghp_your_token_here
```

### 4. Configure MCP (for VS Code/Copilot)

```bash
# Copy the MCP template
cp .vscode/mcp.json.example .vscode/mcp.json

# Edit with your token
nano .vscode/mcp.json
```

Replace `YOUR_TOKEN_HERE` with your GitHub token.

### 5. Install Custom MCP Server

```bash
cd .github/agents/custom-mcp-server
npm install
```

### 6. Commit and Push

```bash
git add .
git commit -m "feat: add multi-agent system"
git push
```

## Verify Installation

### Check GitHub Actions

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. You should see:
   - `Copilot Setup Steps` workflow
   - `Copilot Quality Gate` workflow

### Run a Test

```bash
# Manually trigger the setup workflow
gh workflow run "Copilot Setup Steps"
```

## Using with Copilot

### Slash Commands

| Command | What it does |
|---------|--------------|
| `/init` | Initialize Copilot for your project |
| `/check all` | Run all quality gates |
| `/deploy vercel` | Deploy to Vercel |
| `/release patch` | Create a patch release |
| `/validate "my task"` | Validate task completion |

### Quality Standards

Before any task is marked complete, Copilot will verify:

- ✅ Linting passes with zero errors
- ✅ Type checking passes
- ✅ All tests pass
- ✅ Coverage is ≥ 80%
- ✅ No security vulnerabilities
- ✅ Build succeeds

## Common Issues

### "Permission denied" error

```bash
chmod +x agents/scripts/*.sh agents/install.sh
```

### "Command not found: gh"

Install GitHub CLI:
```bash
# macOS
brew install gh

# Ubuntu/Debian
sudo apt install gh

# Windows
winget install GitHub.cli
```

### Token not recognized

1. Verify your token has `repo` scope
2. Check token hasn't expired
3. Ensure it's set in both `.env` and `.vscode/mcp.json`

## Next Steps

1. Read [GITHUB_TOKEN_GUIDE.md](./GITHUB_TOKEN_GUIDE.md) for token setup
2. Review [agents/README.md](./agents/README.md) for full documentation
3. Check `.github/agents/agent-instructions.md` for quality standards

## Need Help?

- Open an issue: [GitHub Issues](https://github.com/21leahcimhtiek-oss/multi-agent-system/issues)
- Check existing workflows in the Actions tab
- Review logs in `.agent/logs/`