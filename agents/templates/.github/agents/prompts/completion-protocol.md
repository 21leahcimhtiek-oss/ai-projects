# Copilot Completion Protocol

## Before Marking ANY Task Complete

Run through this checklist systematically:

---

### Phase 1: Code Quality

```bash
# Run all quality checks
npm run lint          # Must pass with 0 errors
npm run type-check    # Must pass (if TypeScript)
npm test             # Must pass with 0 failures
npm run build        # Must succeed
```

- [ ] **Linting**: Zero errors (warnings acceptable if documented)
- [ ] **Type Checking**: Zero errors
- [ ] **Tests**: All passing, coverage ≥ 80%
- [ ] **Build**: Successful output

---

### Phase 2: Security Review

```bash
# Security checks
npm audit --audit=moderate
npx snyk test || true
```

- [ ] **No high/critical vulnerabilities**
- [ ] **No hardcoded secrets**
- [ ] **Input validation present**
- [ ] **Auth/authz correct**

---

### Phase 3: Documentation

- [ ] **README updated** (if API/usage changed)
- [ ] **Code comments** for complex logic
- [ ] **Type definitions** (if TypeScript)
- [ ] **API documentation** (if applicable)

---

### Phase 4: Git Hygiene

- [ ] **Atomic commits** with clear messages
- [ ] **No debug code** left behind
- [ ] **No commented-out code**
- [ ] **Proper .gitignore**

---

### Phase 5: Testing Evidence

- [ ] **Unit tests** for new functions
- [ ] **Integration tests** for workflows
- [ ] **Edge cases** covered
- [ ] **Error paths** tested

---

### Phase 6: Final Validation

Answer these questions:

1. **Does this solve the stated problem?**
   - [ ] Yes
   - [ ] No → DO NOT MARK COMPLETE

2. **Are all acceptance criteria met?**
   - [ ] Yes
   - [ ] No → DO NOT MARK COMPLETE

3. **Would you be proud to show this to a senior engineer?**
   - [ ] Yes
   - [ ] No → Refine further

4. **If you came back to this in 6 months, would you understand it?**
   - [ ] Yes
   - [ ] No → Add documentation

---

## Completion Declaration

Only when ALL checkboxes are marked:

```
## Task Complete ✅

### Summary
[Brief description of what was done]

### Changes
- [List of modified files]

### Testing
[How to verify the changes work]

### Notes
[Any follow-up items or considerations]
```

---

## If Something Cannot Be Completed

Do NOT silently proceed. Instead:

1. **STOP**
2. **Document the blocker**
3. **Ask for guidance**
4. **Propose alternatives**

Example:

```
## Blocked ⚠️

### Issue
[Clear description of the blocker]

### Attempted
[What you tried]

### Options
1. [Option A]
2. [Option B]

### Recommendation
[Your suggested path forward]

Waiting for guidance before proceeding.
```