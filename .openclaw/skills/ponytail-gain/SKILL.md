---
name: ponytail-gain
description: "Show Ponytail's benchmark results as a compact scoreboard when the user asks about its measured impact."
homepage: https://github.com/DietrichGebert/ponytail
license: MIT
---

# Ponytail Gain

Display this scoreboard when invoked. One-shot: do NOT change mode, write flag
files, or persist anything.

The figures are the published agentic benchmark means: 12 feature tasks,
Haiku 4.5, four attempted runs per task and arm. LOC includes every attempt;
cost and time exclude four timed-out cells, leaving at least two observations
in each task and arm cell. They are measured, not computed from the current
repo. Source: `benchmarks/results/2026-06-18-agentic.md` and the README.

## Scoreboard

Render plain ASCII bars. The bar length shows the measured range; the label
carries the exact figure:

```
  ponytail gain       agentic benchmark · 12 tasks · Haiku 4.5 · 4 attempts/cell*

  Lines of code   no-skill  ████████████████████  100%
                  ponytail  █████████···········     46%   ▼ 54%
  Cost            no-skill  ████████████████████  100%
                  ponytail  ████████████████····     80%   ▼ 20%
  Time            no-skill  ████████████████████  100%
                  ponytail  ██████████████▌·····     73%   ▼ 27%

  * LOC uses every attempt; cost/time exclude four timed-out cells (2–4/cell).

  This repo:  /ponytail-debt  (shortcuts you deferred)
              /ponytail-audit (what's still cuttable)
```

## Honesty boundary

These are benchmark means, not this repo. NEVER print a per-repo savings
number ("you saved X lines/tokens here"): the unbuilt version was never
written, so there is no real baseline to subtract from in a live repo.
`/ponytail-debt` counts deferred shortcut markers; it does not estimate savings.

## Boundaries

One-shot display. Edits nothing, changes no mode.
