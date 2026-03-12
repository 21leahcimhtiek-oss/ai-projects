# Multi-Agent System for Keith's Development Environment

A comprehensive multi-agent architecture designed for maximum Copilot autonomy and project completion accuracy.

---

## Quick Start

```bash
# Install in your project
./agents/install.sh /path/to/your/project

# Or install in current directory
./agents/install.sh .
```

---

## What This System Provides

### 1. Maximum Copilot Autonomy

The system configures GitHub Copilot's coding agent with:

- **Full development environment**: Node.js, Python, Go, Rust, Docker
- **Cloud CLIs**: Google Cloud, Azure, AWS, Firebase, Expo, Vercel
- **Security tools**: npm audit, Snyk, Semgrep, Trivy
- **MCP servers**: GitHub, filesystem, git, search, browser automation
- **Quality gates**: Linting, testing, type-checking, coverage

### 2. Quality-First Completion Protocol

Every task must pass these gates before completion:

| Gate | Requirement |
|------|-------------|
| Linting | Zero errors |
| Type Check | Zero errors |
| Tests | 100% passing, ≥80% coverage |
| Security | No high/critical vulnerabilities |
| Build | Successful output |

### 3. Custom MCP Tools

Extended capabilities via custom MCP server:

- `run_command` - Execute shell commands
- `analyze_project` - Project structure analysis
- `check_quality` - Run all quality gates
- `generate_changelog` - Auto-generate changelogs
- `create_release` - Version bump and release
- `deploy_preview` - Preview deployments
- `validate_completion` - Task completion validation

---

## Available Agents

| Agent | Trigger | Purpose |
|-------|---------|---------|
| **Setup Refiner** | `setup` | Environment, CI/CD, MCP configs |
| **Code Enhancer** | `code` | Review, optimize, refactor, test |
| **GitHub Manager** | `github` | Repos, issues, PRs, releases |
| **Cross-Platform** | `deploy` | Google, Azure, Expo, Manus, Emergent |

---

## Installation Structure

After running `install.sh`, your project will have:

```
your-project/
├── .github/
│   ├── workflows/
│   │   ├── copilot-setup-steps.yml    # Copilot environment setup
│   │   └── copilot-quality-gate.yml   # Quality validation
│   └── agents/
│       ├── agent-instructions.md       # Copilot behavior rules
│       ├── commands.md                 # Custom slash commands
│       ├── prompts/
│       │   ├── initialization.md       # Startup protocol
│       │   └── completion-protocol.md  # Completion checklist
│       └── custom-mcp-server/          # Extended MCP tools
├── .vscode/
│   └── mcp.json.example               # MCP configuration template
├── .agent/
│   ├── config.json                    # Agent settings
│   ├── sessions/                      # Session data
│   ├── outputs/                       # Generated outputs
│   └── logs/                          # Execution logs
├── .env.example                       # Environment template
└── agents/                            # This agent system
```

---

## Post-Installation Steps

### 1. Configure Authentication

```bash
cp .env.example .env
# Edit .env with your credentials
```

Required for full functionality:
- `GITHUB_TOKEN` - GitHub Personal Access Token
- Platform-specific tokens (Google, Azure, Expo, etc.)

### 2. Configure MCP Servers

```bash
cp .vscode/mcp.json.example .vscode/mcp.json
# Add your tokens to mcp.json
```

### 3. Install Custom MCP Server

```bash
cd .github/agents/custom-mcp-server
npm install
```

### 4. Commit and Push

```bash
git add .
git commit -m "feat: add multi-agent system with Copilot integration"
git push
```

### 5. Verify Setup

Check the **Actions** tab in your GitHub repository to see:
- `Copilot Setup Steps` workflow running
- `Copilot Quality Gate` workflow ready

---

## Copilot Slash Commands

| Command | Purpose |
|---------|---------|
| `/init` | Initialize for current project |
| `/check [type]` | Run quality gates |
| `/deploy <platform>` | Deploy to preview |
| `/release <version>` | Create release |
| `/changelog` | Generate changelog |
| `/review [files]` | Code review |
| `/test [files]` | Generate tests |
| `/refactor <file>` | Refactor code |
| `/doc [files]` | Generate documentation |
| `/fix [type]` | Fix issues |
| `/validate "<task>"` | Validate completion |

---

## Supported Platforms

| Platform | Services |
|----------|----------|
| **Google** | Firebase, Cloud Run, Cloud Functions, BigQuery, Vertex AI |
| **Azure** | Azure AI, Azure DevOps, Azure Functions, Container Apps |
| **Expo** | EAS Build, EAS Submit, Expo CLI |
| **Manus Pro** | AI Automation, Workflow Builder |
| **Emergent AI** | Custom Agents, Model Deployment |
| **Deployment** | Vercel, Netlify, Cloudflare Pages |

---

## Quality Standards

### Code Quality
- Clean code principles
- SOLID principles
- DRY principles
- Design patterns
- Security best practices

### Testing
- Unit tests for all functions
- Integration tests for workflows
- Edge case coverage
- Error path testing

### Documentation
- README updates for API changes
- Code comments for complex logic
- Type definitions (TypeScript)
- API documentation

---

## Communication Protocol

When Copilot needs user input:
1. **STOP** and clearly state what's needed
2. Provide options when possible
3. Explain impact of each option
4. Wait for user decision

---

## File Reference

| File | Purpose |
|------|---------|
| `manifest.json` | Agent system configuration |
| `*/config.yaml` | Individual agent configs |
| `message-bus.json` | Inter-agent communication |
| `launch.sh` | Agent launcher script |
| `agent-workflow.py` | Workflow orchestrator |
| `install.sh` | Installation script |

---

## Support

For issues or feature requests:
1. Check the troubleshooting section
2. Review agent logs in `.agent/logs/`
3. Create an issue using the GitHub Manager agent

---

## Version

- **Version**: 1.0.0
- **Last Updated**: 2025
- **Author**: Multi-Agent System