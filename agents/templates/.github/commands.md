# GitHub Copilot Slash Commands

Custom commands for enhanced Copilot interaction.

---

## /init

Initialize Copilot for the current project.

```
/copilot-init
```

**Actions:**
1. Analyze project structure
2. Identify languages and frameworks
3. Load appropriate tooling
4. Display project summary

---

## /check

Run all quality gates.

```
/copilot-check [lint|test|build|security|all]
```

**Examples:**
- `/check lint` - Run linting only
- `/check all` - Run all quality gates
- `/check security` - Run security scan

---

## /deploy

Deploy to preview environment.

```
/copilot-deploy <platform> [--preview]
```

**Platforms:** vercel, netlify, firebase, cloudflare

**Examples:**
- `/deploy vercel --preview`
- `/deploy firebase`

---

## /release

Create a release with version bump.

```
/copilot-release <version> [--prerelease] [--notes "..."]
```

**Examples:**
- `/release patch` - Bump patch version
- `/release minor` - Bump minor version
- `/release 2.0.0 --notes "Major redesign"`

---

## /changelog

Generate changelog from recent commits.

```
/copilot-changelog [since]
```

**Examples:**
- `/changelog` - Last 10 commits
- `/changelog v1.0.0` - Since tag v1.0.0
- `/changelog main~20` - Last 20 commits

---

## /review

Request a code review.

```
/copilot-review [files...]
```

**Actions:**
1. Analyze code quality
2. Check for security issues
3. Suggest improvements
4. Generate review comments

---

## /test

Generate tests for code.

```
/copilot-test [files...] [--coverage]
```

**Examples:**
- `/test src/utils.ts` - Generate tests for utils
- `/test --coverage` - Run tests with coverage

---

## /refactor

Refactor code for improvement.

```
/copilot-refactor <file> [--focus "..."]
```

**Examples:**
- `/refactor src/api.ts --focus "error handling"`
- `/refactor src/db.ts --focus "performance"`

---

## /doc

Generate documentation.

```
/copilot-doc [files...] [--api] [--readme]
```

**Examples:**
- `/doc src/` - Document all files in src
- `/doc --api` - Generate API documentation
- `/doc --readme` - Update README

---

## /fix

Fix issues in the codebase.

```
/copilot-fix [lint|security|tests|all]
```

**Examples:**
- `/fix lint` - Fix all linting errors
- `/fix security` - Fix security vulnerabilities
- `/fix all` - Fix all auto-fixable issues

---

## /sync

Sync with remote or dependencies.

```
/copilot-sync [deps|env|branch]
```

**Examples:**
- `/sync deps` - Update dependencies
- `/sync env` - Sync .env from .env.example
- `/sync branch` - Sync with remote branch

---

## /validate

Validate task completion.

```
/copilot-validate "<task description>"
```

**Actions:**
1. Check all quality gates
2. Verify requirements met
3. Generate completion report

---

## Note

These commands are custom prompts. To use them, simply type the command as your message to Copilot, and it will understand the intent based on this configuration file.