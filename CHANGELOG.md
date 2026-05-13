# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- **Added**
  - Added `@plasius/ai-evals` scorecard and golden-dataset contracts for quality, cost, latency, confidence, cache-savings, and safety-regression evaluation under `ai.evals-scorecards.enabled`.
- Added fixture-first scorecard execution primitives (`AiEvalFixtureAdapter`, `evaluateAiEvalScorecard`, `compareAiEvalScorecards`) and dataset validation helpers.

- **Changed**
  - Updated package feature flag contract from previous generic evaluator naming to `ai.evals-scorecards.enabled`.

- **Fixed**
  - No behavior regressions fixed in runtime dependencies; all evaluator contracts are now deterministic and testable with fixtures.

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
