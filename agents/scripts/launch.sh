#!/bin/bash
# Multi-Agent Launcher Script
# Launches specialized agents based on task type

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AGENTS_DIR="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Agent definitions
declare -A AGENTS=(
    ["setup"]="setup-refiner"
    ["code"]="code-enhancer"
    ["github"]="github-manager"
    ["deploy"]="cross-platform-integrator"
)

declare -A DESCRIPTIONS=(
    ["setup"]="Setup Refinement Agent - Environment, CI/CD, MCP configs"
    ["code"]="Code Enhancement Agent - Review, optimize, refactor, test"
    ["github"]="GitHub Repo Manager - Repos, issues, PRs, releases"
    ["deploy"]="Cross-Platform Integration - Google, Azure, Expo, Manus"
)

show_help() {
    echo -e "${BLUE}Multi-Agent System Launcher${NC}"
    echo ""
    echo "Usage: $0 <agent-type> [task-description]"
    echo ""
    echo "Available Agents:"
    for key in "${!AGENTS[@]}"; do
        echo -e "  ${GREEN}$key${NC} - ${DESCRIPTIONS[$key]}"
    done
    echo ""
    echo "Examples:"
    echo "  $0 setup &quot;Configure CI/CD pipeline for new microservice&quot;"
    echo "  $0 code &quot;Review and optimize the authentication module&quot;"
    echo "  $0 github &quot;Create release v2.0.0 with changelog&quot;"
    echo "  $0 deploy &quot;Deploy mobile app to iOS and Android stores&quot;"
}

# Check arguments
if [ $# -lt 1 ]; then
    show_help
    exit 1
fi

AGENT_TYPE="$1"
TASK_DESCRIPTION="${2:-}"

# Validate agent type
if [[ ! -v AGENTS[$AGENT_TYPE] ]]; then
    echo -e "${RED}Error: Unknown agent type '$AGENT_TYPE'${NC}"
    echo ""
    show_help
    exit 1
fi

AGENT_ID="${AGENTS[$AGENT_TYPE]}"
AGENT_NAME="${DESCRIPTIONS[$AGENT_TYPE]}"

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Launching: $AGENT_NAME${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "Agent ID: ${YELLOW}$AGENT_ID${NC}"
echo -e "Config: ${YELLOW}$AGENTS_DIR/$AGENT_ID/config.yaml${NC}"
echo ""

if [ -n "$TASK_DESCRIPTION" ]; then
    echo -e "Task: ${YELLOW}$TASK_DESCRIPTION${NC}"
    echo ""
fi

# Create task context file
TASK_FILE="$AGENTS_DIR/$AGENT_ID/current-task.json"
cat > "$TASK_FILE" << EOF
{
    "agent_id": "$AGENT_ID",
    "agent_type": "$AGENT_TYPE",
    "task": "$TASK_DESCRIPTION",
    "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "status": "pending"
}
EOF

echo -e "${GREEN}Task context created: $TASK_FILE${NC}"
echo ""
echo -e "The agent is now ready to process your request."
echo -e "Use this context when interacting with your AI assistant."