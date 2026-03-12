#!/bin/bash
# Multi-Agent System Installation Script
# Sets up the complete agent system in your project

set -e

echo "========================================"
echo "Multi-Agent System Installer"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Determine target directory
TARGET_DIR="${1:-.}"
AGENT_SOURCE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}Installing to: ${TARGET_DIR}${NC}"
echo ""

# Create directory structure
echo -e "${YELLOW}Creating directory structure...${NC}"
mkdir -p "${TARGET_DIR}/.github/workflows"
mkdir -p "${TARGET_DIR}/.github/agents/custom-mcp-server"
mkdir -p "${TARGET_DIR}/.github/agents/prompts"
mkdir -p "${TARGET_DIR}/.agent"
mkdir -p "${TARGET_DIR}/.vscode"

# Copy GitHub Actions workflows
echo -e "${YELLOW}Setting up GitHub Actions workflows...${NC}"
cp "${AGENT_SOURCE}/templates/github-actions/copilot-setup-steps-ultimate.yml" \
   "${TARGET_DIR}/.github/workflows/copilot-setup-steps.yml"
cp "${AGENT_SOURCE}/templates/.github/agents/copilot-quality-gate.yml" \
   "${TARGET_DIR}/.github/workflows/copilot-quality-gate.yml"

# Copy agent configurations
echo -e "${YELLOW}Setting up agent configurations...${NC}"
cp "${AGENT_SOURCE}/templates/.github/agents/agent-instructions.md" \
   "${TARGET_DIR}/.github/agents/agent-instructions.md"
cp "${AGENT_SOURCE}/templates/.github/commands.md" \
   "${TARGET_DIR}/.github/commands.md"
cp "${AGENT_SOURCE}/templates/.github/agents/prompts/initialization.md" \
   "${TARGET_DIR}/.github/agents/prompts/initialization.md"
cp "${AGENT_SOURCE}/templates/.github/agents/prompts/completion-protocol.md" \
   "${TARGET_DIR}/.github/agents/prompts/completion-protocol.md"

# Copy custom MCP server
echo -e "${YELLOW}Setting up custom MCP server...${NC}"
cp "${AGENT_SOURCE}/templates/.github/agents/custom-mcp-server/index.js" \
   "${TARGET_DIR}/.github/agents/custom-mcp-server/index.js"
cp "${AGENT_SOURCE}/templates/.github/agents/custom-mcp-server/package.json" \
   "${TARGET_DIR}/.github/agents/custom-mcp-server/package.json"

# Copy MCP configuration templates
echo -e "${YELLOW}Setting up MCP configuration...${NC}"
cp "${AGENT_SOURCE}/templates/mcp/copilot-mcp-ultimate.json" \
   "${TARGET_DIR}/.vscode/mcp.json.example"

# Copy templates directory
echo -e "${YELLOW}Copying templates...${NC}"
cp -r "${AGENT_SOURCE}/templates/github-actions" "${TARGET_DIR}/agents/templates/"
cp -r "${AGENT_SOURCE}/templates/mcp" "${TARGET_DIR}/agents/templates/"

# Create .env.example
echo -e "${YELLOW}Creating environment template...${NC}"
cp "${AGENT_SOURCE}/templates/.env.example" \
   "${TARGET_DIR}/.env.example"

# Create agent workspace
echo -e "${YELLOW}Creating agent workspace...${NC}"
mkdir -p "${TARGET_DIR}/.agent/sessions"
mkdir -p "${TARGET_DIR}/.agent/outputs"
mkdir -p "${TARGET_DIR}/.agent/cache"
mkdir -p "${TARGET_DIR}/.agent/logs"

# Create agent config
cat > "${TARGET_DIR}/.agent/config.json" << 'EOF'
{
  "version": "1.0.0",
  "autonomy_level": "maximum",
  "quality_gates": {
    "tests_required": true,
    "coverage_minimum": 80,
    "linting_strict": true,
    "security_scan": true,
    "type_check": true
  },
  "completion_criteria": {
    "all_tests_passing": true,
    "no_security_vulnerabilities": true,
    "documentation_updated": true,
    "changelog_updated": true
  }
}
EOF

# Create .gitignore entries
echo -e "${YELLOW}Updating .gitignore...${NC}"
if [ -f "${TARGET_DIR}/.gitignore" ]; then
    if ! grep -q "# Agent System" "${TARGET_DIR}/.gitignore"; then
        cat >> "${TARGET_DIR}/.gitignore" << 'EOF'

# Agent System
.agent/sessions/
.agent/cache/
.agent/logs/
.env
.env.local
*.pem
*.key
EOF
    fi
else
    cat > "${TARGET_DIR}/.gitignore" << 'EOF'
# Dependencies
node_modules/

# Build
dist/
build/

# Agent System
.agent/sessions/
.agent/cache/
.agent/logs/
.env
.env.local
*.pem
*.key

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
EOF
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Installation Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Next steps:"
echo ""
echo -e "1. ${YELLOW}Configure authentication:${NC}"
echo "   cp .env.example .env"
echo "   # Edit .env with your credentials"
echo ""
echo -e "2. ${YELLOW}Configure MCP servers (for Copilot):${NC}"
echo "   cp .vscode/mcp.json.example .vscode/mcp.json"
echo "   # Add your GitHub token to mcp.json"
echo ""
echo -e "3. ${YELLOW}Install custom MCP server dependencies:${NC}"
echo "   cd .github/agents/custom-mcp-server && npm install"
echo ""
echo -e "4. ${YELLOW}Commit the setup:${NC}"
echo "   git add ."
echo "   git commit -m 'feat: add multi-agent system with Copilot integration'"
echo "   git push"
echo ""
echo -e "5. ${YELLOW}Test the setup:${NC}"
echo "   # The copilot-setup-steps workflow will run automatically"
echo "   # Check the Actions tab in your GitHub repository"
echo ""