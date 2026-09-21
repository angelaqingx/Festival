# Subagent Delegation Principles

## Core Principle
- **Use subagents for all tasks**: Break development work into small, bounded, single-purpose tasks and dispatch dedicated subagents for each step.
- **Small and bounded**: Every subagent invocation must have a well-defined, tightly scoped objective (e.g., stage specific files, inspect diff, write a targeted unit test, verify build).
- **Always invoke for repeated tasks**:
  - **Git / GitHub Operations**: Branching, staging in-scope files only, conventional commits, status checks, pre-push verification.
  - **Code Review & Diff Inspection**: Checking diff footprint, verifying absence of debug logging or credentials, catching scope creep.
  - **Scoped Implementation**: Executing single-objective code modifications on targeted files.
  - **Verification & Testing**: Running toolchain checks, format checks, builds, and automated tests.
  - **Goal & Scope Tracking**: Validating progress against documented criteria and preventing drift.
