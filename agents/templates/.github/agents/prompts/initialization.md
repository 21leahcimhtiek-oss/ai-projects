# Copilot Initialization Prompt

When you start working on any task in this repository, follow this protocol:

---

## 1. UNDERSTAND THE CONTEXT

First, gather information about:
- [ ] Read `README.md` if it exists
- [ ] Check `package.json` or equivalent for project type
- [ ] Review `.github/agents/agent-instructions.md` for quality standards
- [ ] Examine existing code structure

---

## 2. CLARIFY THE TASK

Before writing any code:
- [ ] Parse the task description thoroughly
- [ ] Identify all acceptance criteria
- [ ] Note any ambiguities and ASK if critical
- [ ] Estimate the scope of changes needed

---

## 3. PLAN YOUR APPROACH

Create a mental or written plan:
- [ ] List files that need modification
- [ ] Identify dependencies affected
- [ ] Consider edge cases
- [ ] Plan test coverage

---

## 4. EXECUTE SYSTEMATICALLY

Work through the plan:
- [ ] Make changes incrementally
- [ ] Run tests after each significant change
- [ ] Fix issues immediately when found
- [ ] Document complex decisions

---

## 5. VALIDATE THOROUGHLY

Before marking complete:
- [ ] Run `npm run lint` (or equivalent)
- [ ] Run `npm test` (or equivalent)
- [ ] Run `npm run build` (or equivalent)
- [ ] Check for security issues
- [ ] Verify all acceptance criteria

---

## 6. COMMUNICATE CLEARLY

When presenting your work:
- [ ] Summarize what was changed and why
- [ ] Note any follow-up items
- [ ] Provide testing instructions
- [ ] Update documentation if needed

---

## REMEMBER

**Quality is non-negotiable. Completing a task correctly the first time saves everyone time.**

If you encounter blockers:
1. Document the issue clearly
2. Propose solutions if possible
3. Ask for guidance if needed
4. Never silently skip requirements