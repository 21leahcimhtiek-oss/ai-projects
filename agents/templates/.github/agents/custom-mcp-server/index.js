#!/usr/bin/env node

/**
 * Custom MCP Server for Extended Copilot Capabilities
 * Provides additional tools for project completion
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdServerTransport } from '@modelcontextprotocol/sdk/server/transport.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { execSync, exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

const server = new Server(
  { name: 'custom-tools', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

// Tool definitions
const tools = [
  {
    name: 'run_command',
    description: 'Execute a shell command and return the output',
    inputSchema: {
      type: 'object',
      properties: {
        command: { type: 'string', description: 'Command to execute' },
        cwd: { type: 'string', description: 'Working directory', default: '.' },
        timeout: { type: 'number', description: 'Timeout in ms', default: 60000 }
      },
      required: ['command']
    }
  },
  {
    name: 'analyze_project',
    description: 'Analyze project structure and return summary',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Project path', default: '.' }
      }
    }
  },
  {
    name: 'check_quality',
    description: 'Run all quality checks (lint, test, build, security)',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Project path', default: '.' },
        checks: {
          type: 'array',
          items: { type: 'string', enum: ['lint', 'test', 'build', 'security', 'typecheck'] },
          description: 'Checks to run'
        }
      }
    }
  },
  {
    name: 'generate_changelog',
    description: 'Generate a changelog from recent commits',
    inputSchema: {
      type: 'object',
      properties: {
        since: { type: 'string', description: 'Git ref to start from', default: 'HEAD~10' },
        format: { type: 'string', enum: ['markdown', 'json'], default: 'markdown' }
      }
    }
  },
  {
    name: 'create_release',
    description: 'Create a release with version bump and changelog',
    inputSchema: {
      type: 'object',
      properties: {
        version: { type: 'string', description: 'New version or bump type (major/minor/patch)' },
        prerelease: { type: 'boolean', default: false },
        notes: { type: 'string', description: 'Release notes' }
      },
      required: ['version']
    }
  },
  {
    name: 'deploy_preview',
    description: 'Create a preview deployment',
    inputSchema: {
      type: 'object',
      properties: {
        platform: { type: 'string', enum: ['vercel', 'netlify', 'firebase', 'cloudflare'] },
        branch: { type: 'string', description: 'Branch to deploy', default: 'current' }
      },
      required: ['platform']
    }
  },
  {
    name: 'sync_env',
    description: 'Sync environment variables from secrets or .env.example',
    inputSchema: {
      type: 'object',
      properties: {
        source: { type: 'string', description: 'Source file or secrets path' },
        target: { type: 'string', description: 'Target environment', default: '.env' }
      }
    }
  },
  {
    name: 'validate_completion',
    description: 'Validate that a task is fully complete according to quality gates',
    inputSchema: {
      type: 'object',
      properties: {
        task: { type: 'string', description: 'Task description to validate' },
        requirements: { type: 'array', items: { type: 'string' }, description: 'Specific requirements to check' }
      },
      required: ['task']
    }
  }
];

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    switch (name) {
      case 'run_command': {
        const { command, cwd = '.', timeout = 60000 } = args;
        try {
          const output = execSync(command, { cwd, timeout, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
          return { content: [{ type: 'text', text: output || 'Command completed successfully' }] };
        } catch (error) {
          return { content: [{ type: 'text', text: `Error: ${error.message}\nStderr: ${error.stderr}` }], isError: true };
        }
      }
      
      case 'analyze_project': {
        const projectPath = args.path || '.';
        const packageJson = await fs.readFile(path.join(projectPath, 'package.json'), 'utf8').catch(() => null);
        const goMod = await fs.readFile(path.join(projectPath, 'go.mod'), 'utf8').catch(() => null);
        const cargoToml = await fs.readFile(path.join(projectPath, 'Cargo.toml'), 'utf8').catch(() => null);
        const pyproject = await fs.readFile(path.join(projectPath, 'pyproject.toml'), 'utf8').catch(() => null);
        
        const analysis = {
          languages: [],
          frameworks: [],
          hasTests: false,
          hasCI: false,
          structure: {}
        };
        
        if (packageJson) {
          const pkg = JSON.parse(packageJson);
          analysis.languages.push('JavaScript/TypeScript');
          if (pkg.dependencies?.react || pkg.devDependencies?.react) analysis.frameworks.push('React');
          if (pkg.dependencies?.next || pkg.devDependencies?.next) analysis.frameworks.push('Next.js');
          if (pkg.dependencies?.express) analysis.frameworks.push('Express');
          if (pkg.dependencies?.vue || pkg.devDependencies?.vue) analysis.frameworks.push('Vue');
          if (pkg.scripts?.test) analysis.hasTests = true;
        }
        
        if (goMod) {
          analysis.languages.push('Go');
          analysis.hasTests = await fs.access(path.join(projectPath, '*_test.go')).then(() => true).catch(() => false);
        }
        
        if (cargoToml) {
          analysis.languages.push('Rust');
        }
        
        if (pyproject) {
          analysis.languages.push('Python');
        }
        
        analysis.hasCI = await fs.access(path.join(projectPath, '.github/workflows')).then(() => true).catch(() => false);
        
        return { content: [{ type: 'text', text: JSON.stringify(analysis, null, 2) }] };
      }
      
      case 'check_quality': {
        const projectPath = args.path || '.';
        const checks = args.checks || ['lint', 'test', 'build'];
        const results = {};
        
        for (const check of checks) {
          try {
            let command;
            switch (check) {
              case 'lint': command = 'npm run lint'; break;
              case 'test': command = 'npm test'; break;
              case 'build': command = 'npm run build'; break;
              case 'security': command = 'npm audit --audit=moderate'; break;
              case 'typecheck': command = 'npm run type-check || npx tsc --noEmit'; break;
            }
            const output = execSync(command, { cwd: projectPath, encoding: 'utf8', stdio: 'pipe' });
            results[check] = { passed: true, output: output.slice(-500) };
          } catch (error) {
            results[check] = { passed: false, error: error.message };
          }
        }
        
        return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
      }
      
      case 'generate_changelog': {
        const since = args.since || 'HEAD~10';
        const format = args.format || 'markdown';
        
        try {
          const commits = execSync(`git log ${since}..HEAD --pretty=format:"%h|%s|%an|%ad" --date=short`, { encoding: 'utf8' });
          const lines = commits.split('\n').filter(Boolean);
          
          if (format === 'json') {
            const data = lines.map(line => {
              const [hash, message, author, date] = line.split('|');
              return { hash, message, author, date };
            });
            return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
          }
          
          const changelog = `# Changelog\n\n${lines.map(line => {
            const [hash, message, author, date] = line.split('|');
            return `- ${date}: ${message} (${hash})`;
          }).join('\n')}`;
          
          return { content: [{ type: 'text', text: changelog }] };
        } catch (error) {
          return { content: [{ type: 'text', text: `Error: ${error.message}` }], isError: true };
        }
      }
      
      case 'create_release': {
        const { version, prerelease = false, notes = '' } = args;
        try {
          // Bump version
          execSync(`npm version ${version} -m "chore: release %s"`, { encoding: 'utf8' });
          const newVersion = execSync('node -p "require(\'./package.json\').version"', { encoding: 'utf8' }).trim();
          
          // Create tag
          execSync(`git tag -a v${newVersion} -m "Release v${newVersion}${notes ? '\n\n' + notes : ''}"`, { encoding: 'utf8' });
          
          // Push
          execSync('git push --follow-tags', { encoding: 'utf8' });
          
          return { content: [{ type: 'text', text: `Created release v${newVersion}${prerelease ? ' (prerelease)' : ''}` }] };
        } catch (error) {
          return { content: [{ type: 'text', text: `Error: ${error.message}` }], isError: true };
        }
      }
      
      case 'deploy_preview': {
        const { platform, branch } = args;
        try {
          let command;
          switch (platform) {
            case 'vercel':
              command = 'npx vercel --yes';
              break;
            case 'netlify':
              command = 'npx netlify deploy --preview';
              break;
            case 'firebase':
              command = 'npx firebase hosting:channel:deploy preview';
              break;
            case 'cloudflare':
              command = 'npx wrangler pages deploy ./dist';
              break;
          }
          const output = execSync(command, { encoding: 'utf8', timeout: 120000 });
          return { content: [{ type: 'text', text: `Deployed to ${platform}:\n${output}` }] };
        } catch (error) {
          return { content: [{ type: 'text', text: `Deployment error: ${error.message}` }], isError: true };
        }
      }
      
      case 'sync_env': {
        const { source, target = '.env' } = args;
        try {
          if (source) {
            await fs.copyFile(source, target);
            return { content: [{ type: 'text', text: `Synced ${source} to ${target}` }] };
          }
          // Copy from .env.example
          await fs.copyFile('.env.example', target);
          return { content: [{ type: 'text', text: 'Created .env from .env.example' }] };
        } catch (error) {
          return { content: [{ type: 'text', text: `Error: ${error.message}` }], isError: true };
        }
      }
      
      case 'validate_completion': {
        const { task, requirements = [] } = args;
        const checks = {
          task_specified: !!task,
          has_code_changes: false,
          tests_passing: false,
          linting_passing: false,
          build_passing: false,
          requirements_met: requirements.length === 0
        };
        
        // Check for code changes
        try {
          const status = execSync('git status --porcelain', { encoding: 'utf8' });
          checks.has_code_changes = status.trim().length > 0;
        } catch {}
        
        // Run quality checks
        try { execSync('npm test', { stdio: 'pipe' }); checks.tests_passing = true; } catch {}
        try { execSync('npm run lint', { stdio: 'pipe' }); checks.linting_passing = true; } catch {}
        try { execSync('npm run build', { stdio: 'pipe' }); checks.build_passing = true; } catch {}
        
        const allPassed = Object.values(checks).every(v => v === true);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              task,
              validated: allPassed,
              checks,
              summary: allPassed ? '✅ Task appears complete' : '❌ Task incomplete - see checks above'
            }, null, 2)
          }]
        };
      }
      
      default:
        return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
    }
  } catch (error) {
    return { content: [{ type: 'text', text: `Server error: ${error.message}` }], isError: true };
  }
});

// Start server
async function main() {
  const transport = new StdServerTransport();
  await server.connect(transport);
}

main().catch(console.error);