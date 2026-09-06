---
name: ponytail-debt
description: Collect `ponytail:` shortcut comments into a debt ledger when the user asks what Ponytail deferred.
---

Every deliberate ponytail shortcut is marked with a `ponytail:` comment naming
its ceiling and upgrade path. This collects them into one ledger so a deferral
can't quietly become permanent.

## Scan

Search from the repository root with `rg`, skipping directory basenames for
dependencies, VCS metadata, and generated output:

`rg --hidden -n '(#|//) ?ponytail:' -g '!node_modules' -g '!.git' -g '!build' -g '!dist' .`

Each hit is one ledger row. The comment prefix keeps prose that merely mentions
the convention out of the ledger.

## Output

One row per marker, grouped by file:

`<file>:<line>, <what was simplified>. ceiling: <the limit named>. upgrade: <the trigger to revisit>.`

The convention is `ponytail: <ceiling>, <upgrade path>`, so pull the ceiling
and the trigger straight from the comment. Want an owner per row too? add
`git blame -L<line>,<line>`.

Flag the rot risk: any `ponytail:` comment that names no upgrade path or
trigger gets a `no-trigger` tag, those are the ones that silently rot.

End with `<N> markers, <M> with no trigger.` Nothing found: `No ponytail: debt. Clean ledger.`

## Boundaries

Reads and reports only, changes nothing. Write the ledger to a file such as
`PONYTAIL-DEBT.md` only when the user requests persistence. One-shot.
