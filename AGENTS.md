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

## Windows / PowerShell Execution Standards
- **PowerShell (pwsh) Native Commands**: All terminal commands must be written natively for Windows PowerShell (`pwsh`).
- **Forbidden Linux / Bash Idioms**:
  - Do not use `export VAR=val` (use `$env:VAR = "val"` instead).
  - Do not use Bash-style chaining `&&` where unsupported; use `;` or execute separate commands.
  - Do not use Bash subshells `$(command)` or Unix tools expecting standard POSIX environments.
  - Do not execute `.sh` scripts directly; provide PowerShell scripts (`.ps1`) or invoke explicit Windows-compatible tools.
- **Environment Variables**: Access and set environment variables using PowerShell syntax (`$env:VARIABLE_NAME`).
- **Path Separators and Quoting**:
  - Use backslashes (`\`) or forward slashes (`/`) compatible with PowerShell.
  - Always quote paths containing spaces or special characters (e.g., `"C:\path with spaces\file"`).
- **Command Formatting**: Use native PowerShell cmdlets and syntax, taking care to avoid assuming GNU/Linux flags on Windows binaries or PowerShell alias behaviors.
