# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## [Unreleased]

- **Added**
  - (placeholder)

- **Changed**
  - (placeholder)

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [0.1.9] - 2026-06-28

- **Added**
  - (placeholder)

- **Changed**
  - Refreshed the `@plasius/ai-config` dependency to `^0.1.7` and updated development dependency baselines to `@types/node@26.0.1`, `@typescript-eslint/*@8.62.0`, `eslint@10.6.0`, and `globals@17.7.0`.

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [0.1.8] - 2026-06-22

- **Added**
  - (placeholder)

- **Changed**
  - (placeholder)

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [0.1.7] - 2026-06-22
- **Added**
  - (placeholder)

- **Changed**
  - (placeholder)

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [0.1.6] - 2026-06-19

- **Added**
  - Added `@plasius/ai-evals` scorecard and golden-dataset contracts for quality, cost, latency, confidence, cache-savings, and safety-regression evaluation under `ai.evals-scorecards.enabled`.
  - Added Player System governance scorecard datasets and helpers for tutorial usefulness, mission fit, preference learning, voice intent, and reward boundedness under the inherited rollout `isekai.player-system.governance.enabled`.
- Added fixture-first scorecard execution primitives (`AiEvalFixtureAdapter`, `evaluateAiEvalScorecard`, `compareAiEvalScorecards`) and dataset validation helpers.
  - Added Quiet Measure fixture-pack exports and scorecard helpers for heroic, villainous, counterfeit, tyrant, and redeemed-character regression checks under `isekai.player-system.quiet-measure.enabled`.

- **Changed**
  - Updated package feature flag contract from previous generic evaluator naming to `ai.evals-scorecards.enabled`.
  - Refreshed `@plasius/ai-config`, `@types/node`, `@typescript-eslint/*`, `eslint`, and `vitest` dependency baselines to the latest stable published versions used by this package.

- **Fixed**
  - No behavior regressions fixed in runtime dependencies; all evaluator contracts are now deterministic and testable with fixtures.
  - Moved package publication to a protected-main-safe release-prep flow so `cd.yml` no longer fails on direct pushes to protected `main`.

- **Security**
  - (placeholder)

## [0.1.3] - 2026-05-13

- **Added**
  - (placeholder)

- **Changed**
  - Refreshed dependencies to the latest stable published versions.
  - (placeholder)

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [0.1.2] - 2026-05-13

- **Added**
  - (placeholder)

- **Changed**
  - (placeholder)

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [0.1.1] - 2026-05-13

- Added initial public package scaffold with governance, legal, docs, build, test, and pack-check baselines.


[0.1.1]: https://github.com/Plasius-LTD/ai-evals/releases/tag/v0.1.1
[0.1.2]: https://github.com/Plasius-LTD/ai-evals/releases/tag/v0.1.2
[0.1.3]: https://github.com/Plasius-LTD/ai-evals/releases/tag/v0.1.3
[0.1.6]: https://github.com/Plasius-LTD/ai-evals/releases/tag/v0.1.6
[0.1.7]: https://github.com/Plasius-LTD/ai-evals/releases/tag/v0.1.7
[0.1.8]: https://github.com/Plasius-LTD/ai-evals/releases/tag/v0.1.8
[0.1.9]: https://github.com/Plasius-LTD/ai-evals/releases/tag/v0.1.9
