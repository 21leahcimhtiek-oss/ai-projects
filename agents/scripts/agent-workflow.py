#!/usr/bin/env python3
"""
Multi-Agent Workflow Orchestrator
Coordinates multiple agents for complex tasks
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Optional

# Agent configurations
AGENTS = {
    "setup": {
        "id": "setup-refiner",
        "name": "Setup Refinement Agent",
        "triggers": ["setup", "configure", "ci", "cd", "pipeline", "environment", "mcp"],
        "capabilities": ["environment-configuration", "cicd-pipeline-management", "mcp-server-setup"]
    },
    "code": {
        "id": "code-enhancer", 
        "name": "Code Enhancement Agent",
        "triggers": ["review", "optimize", "refactor", "test", "lint", "document"],
        "capabilities": ["code-review", "optimization", "refactoring", "test-generation"]
    },
    "github": {
        "id": "github-manager",
        "name": "GitHub Repo Manager Agent",
        "triggers": ["repo", "issue", "pr", "release", "branch", "github"],
        "capabilities": ["repository-management", "issue-tracking", "pull-request-management"]
    },
    "deploy": {
        "id": "cross-platform-integrator",
        "name": "Cross-Platform Integration Agent",
        "triggers": ["google", "azure", "expo", "manus", "emergent", "deploy", "integrate"],
        "capabilities": ["multi-platform-sync", "deployment", "cross-platform-testing"]
    }
}

# Platform integrations
PLATFORMS = {
    "google": ["firebase", "google-cloud", "vertex-ai", "bigquery"],
    "azure": ["azure-ai", "azure-devops", "azure-functions", "container-apps"],
    "expo": ["eas-build", "eas-submit", "expo-cli"],
    "manus": ["manus-pro"],
    "emergent": ["emergent-ai"]
}


class AgentOrchestrator:
    """Orchestrates multi-agent workflows"""
    
    def __init__(self, base_path: str = "."):
        self.base_path = Path(base_path)
        self.agents_dir = self.base_path / "agents"
        self.ensure_directories()
    
    def ensure_directories(self):
        """Create necessary directories"""
        for agent_key in AGENTS:
            agent_dir = self.agents_dir / AGENTS[agent_key]["id"]
            agent_dir.mkdir(parents=True, exist_ok=True)
    
    def classify_task(self, task: str) -> list[str]:
        """Classify task to determine which agents are needed"""
        task_lower = task.lower()
        matched_agents = []
        
        for agent_key, agent_config in AGENTS.items():
            for trigger in agent_config["triggers"]:
                if trigger in task_lower:
                    if agent_key not in matched_agents:
                        matched_agents.append(agent_key)
                    break
        
        return matched_agents if matched_agents else ["code"]  # Default to code agent
    
    def detect_platforms(self, task: str) -> list[str]:
        """Detect which platforms are mentioned in the task"""
        task_lower = task.lower()
        detected = []
        
        for platform, services in PLATFORMS.items():
            if platform in task_lower:
                detected.append(platform)
            for service in services:
                if service.replace("-", " ") in task_lower or service in task_lower:
                    if platform not in detected:
                        detected.append(platform)
        
        return detected
    
    def create_workflow(self, task: str, agents: Optional[list[str]] = None) -> dict[str, Any]:
        """Create a workflow for the given task"""
        if agents is None:
            agents = self.classify_task(task)
        
        platforms = self.detect_platforms(task)
        
        workflow = {
            "id": f"workflow-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}",
            "created_at": datetime.utcnow().isoformat() + "Z",
            "task": task,
            "agents": [],
            "platforms": platforms,
            "steps": [],
            "status": "pending"
        }
        
        # Determine workflow order based on task type
        if "setup" in agents or "configure" in task.lower():
            workflow["steps"].append({"agent": "setup", "action": "configure", "status": "pending"})
        
        if "code" in agents:
            workflow["steps"].append({"agent": "code", "action": "analyze", "status": "pending"})
        
        if "github" in agents:
            workflow["steps"].append({"agent": "github", "action": "execute", "status": "pending"})
        
        if "deploy" in agents or platforms:
            workflow["steps"].append({"agent": "deploy", "action": "deploy", "status": "pending"})
        
        # Add agent details
        for agent_key in agents:
            if agent_key in AGENTS:
                workflow["agents"].append({
                    "key": agent_key,
                    "id": AGENTS[agent_key]["id"],
                    "name": AGENTS[agent_key]["name"]
                })
        
        return workflow
    
    def save_workflow(self, workflow: dict[str, Any]) -> str:
        """Save workflow to file"""
        workflow_file = self.agents_dir / "workflows" / f"{workflow['id']}.json"
        workflow_file.parent.mkdir(parents=True, exist_ok=True)
        
        with open(workflow_file, 'w') as f:
            json.dump(workflow, f, indent=2)
        
        return str(workflow_file)
    
    def print_workflow_summary(self, workflow: dict[str, Any]):
        """Print a summary of the workflow"""
        print("\n" + "="*60)
        print(f"Workflow: {workflow['id']}")
        print("="*60)
        print(f"\nTask: {workflow['task']}")
        print(f"\nAgents involved:")
        for agent in workflow['agents']:
            print(f"  - {agent['name']} ({agent['key']})")
        
        if workflow['platforms']:
            print(f"\nPlatforms detected: {', '.join(workflow['platforms'])}")
        
        print(f"\nWorkflow steps:")
        for i, step in enumerate(workflow['steps'], 1):
            print(f"  {i}. [{step['agent']}] {step['action']}")
        
        print("\n" + "="*60 + "\n")


def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        print("Usage: python agent-workflow.py &quot;your task description&quot;")
        print("\nExample:")
        print('  python agent-workflow.py "Review code and deploy to Firebase"')
        sys.exit(1)
    
    task = " ".join(sys.argv[1:])
    
    orchestrator = AgentOrchestrator()
    workflow = orchestrator.create_workflow(task)
    workflow_file = orchestrator.save_workflow(workflow)
    
    orchestrator.print_workflow_summary(workflow)
    print(f"Workflow saved to: {workflow_file}")
    print("\nUse this workflow context when interacting with your AI assistant.")


if __name__ == "__main__":
    main()