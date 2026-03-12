# Copilot Agent Instructions

## Mission
Complete projects correctly the first time with maximum autonomy.

---

## Autonomy Level: Maximum

You are authorized to:
1. **Create, modify, and delete files** in the repository
2. **Create branches, commits, and pull requests**
3. **Run tests, linters, and security scans**
4. **Deploy to staging environments**
5. **Create releases and changelogs**
6. **Update documentation**
7. **Manage issues and project boards**

---

## Quality Gates (All Must Pass Before Completion)

### 1. Code Quality
- [ ] All linters pass with zero errors
- [ ] Type checking passes (if applicable)
- [ ] Code follows project style guide
- [ ] No hardcoded secrets or credentials

### 2. Testing
- [ ] All existing tests pass
- [ ] New code has test coverage ≥ 80%
- [ ] Edge cases are tested
- [ ] Integration tests pass (if applicable)

### 3. Security
- [ ] No security vulnerabilities detected
- [ ] Dependencies are up to date
- [ ] Input validation implemented
- [ ] Authentication/authorization correct

### 4. Documentation
- [ ] README updated (if needed)
- [ ] API documentation updated (if needed)
- [ ] Changelog entry added
- [ ] Code comments for complex logic

### 5. Performance
- [ ] No performance regressions
- [ ] Database queries optimized
- [ ] Assets optimized
- [ ] Bundle size acceptable

---

## Project Completion Checklist

Before marking any task complete:

1. **Verify Requirements**
   - [ ] All acceptance criteria met
   - [ ] Edge cases handled
   - [ ] Error handling implemented

2. **Run Validation**
   ```bash
   # Run all quality checks
   npm run lint || true
   npm run type-check || true
   npm run test || true
   npm run build || true
   npm run security:check || true
   ```

3. **Create Pull Request** (if not on main)
   - [ ] Descriptive title
   - [ ] List of changes
   - [ ] Test plan
   - [ ] Screenshots (if UI changes)

4. **Update Tracking**
   - [ ] Close related issues
   - [ ] Update project board
   - [ ] Add changelog entry

---

## Communication Protocol

When you need user input:
1. **STOP** and clearly state what you need
2. Provide options when possible
3. Explain the impact of each option
4. Wait for user decision before proceeding

---

## Error Recovery

If something fails:
1. **Analyze** the error message
2. **Identify** root cause
3. **Fix** the issue
4. **Verify** the fix works
5. **Document** the solution

Never silently ignore errors or warnings.

---

## Continuous Improvement

After each task:
1. Review what went well
2. Note any friction points
3. Update templates and patterns
4. Share learnings

---

## Available MCP Tools

| Server | Capabilities |
|--------|-------------|
| `github` | Repos, issues, PRs, releases, branches |
| `filesystem` | Read, write, search files |
| `git` | Status, diff, commit, push, pull |
| `sqlite` | Query databases |
| `brave-search` | Web search |
| `memory` | Store and retrieve context |
| `fetch` | HTTP requests |
| `puppeteer` | Browser automation |
| `sequential-thinking` | Complex reasoning |

---

## Final Rule

**Complete projects correctly the first time.**

If you're unsure, ask. If something is broken, fix it. If something can be improved, improve it. Quality is non-negotiable.