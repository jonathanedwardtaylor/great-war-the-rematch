# AI Workflow

## Working Style

Use Codex to make small, reviewable changes. Each task should have a clear goal, a short scope, and a verification step.

## Good Prompt Shape

```text
Goal:
What should change?

Context:
Relevant files, rules, or design notes.

Constraints:
What should not change?

Acceptance Criteria:
How will we know it is done?

Verification:
Which commands or manual checks should run?
```

## Prompting Rules

- Keep tasks small enough to review.
- Update docs when decisions change.
- Ask Codex to explain unfamiliar code after implementation.
- Prefer tested game rules over untested behavior.
- Avoid adding backend, accounts, or app store work until the first playable is fun.

## Standard Finish Checklist

- Code or docs changed as requested.
- Tests or relevant checks run.
- Important decisions recorded.
- Next step is clear.
