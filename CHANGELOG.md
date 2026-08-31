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

## [1.0.2] - 2026-08-31

- **Added**
  - (placeholder)

- **Changed**
  - Restored exact-main npm publication on a GitHub-hosted runner through
    short-lived OIDC, with an enforced Node/npm runtime and no long-lived
    write-token fallback.
  - Routed reviewed validation to explicit GitHub-hosted capacity with
    package-manager caching disabled and fork PR execution rejected.
  - (placeholder)

- **Fixed**
  - Declared `esbuild` directly so clean installs can resolve tsup's runtime build dependency under the audited override set.
  - (placeholder)

- **Security**
  - (placeholder)

## [1.0.1] - 2026-08-30

- **Added**
  - (placeholder)

- **Changed**
  - (placeholder)

- **Fixed**
  - Aggregate metric pass rates now count every required fixture sample, so missing values, non-finite observations, and adapter failures cannot overstate evaluation quality; the optional `featureEnabled` contract is also covered as a fail-closed, zero-execution default.
  - Scorecards now copy and freeze metric thresholds, reject duplicate metric
    expectations, report the uniform effective fixture threshold, and fail
    closed on heterogeneous effective thresholds regardless of fixture order.

- **Security**
  - Raised transitive development-tool floors for `brace-expansion`,
    `esbuild`, `nanoid`, and `postcss` to remediate current audit advisories.

## [1.0.0] - 2026-07-15

- **Added**
  - (placeholder)

- **Changed**
  - **Breaking:** replaced the exported Player System governance and Quiet Measure rollout values from `isekai.player-system.*` to `harmony.player-system.*`. The next release is a major version and intentionally provides no aliases, dual-read parsing, or legacy runtime fallback.

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [0.1.11] - 2026-07-12

- **Added**
  - (placeholder)

- **Changed**
  - Refreshed the lockfile to consume `@plasius/ai-config@0.1.8` and the latest stable compatible development toolchain releases.

- **Fixed**
  - (placeholder)

- **Security**
  - (placeholder)

## [0.1.10] - 2026-07-02

- **Added**
  - (placeholder)

- **Changed**
  - Scorecard execution now defaults disabled unless callers pass an explicit feature-flag decision; env-name helpers remain only as deprecated local-tooling compatibility APIs.

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
[0.1.10]: https://github.com/Plasius-LTD/ai-evals/releases/tag/v0.1.10
[0.1.11]: https://github.com/Plasius-LTD/ai-evals/releases/tag/v0.1.11
[1.0.0]: https://github.com/Plasius-LTD/ai-evals/releases/tag/v1.0.0
[1.0.1]: https://github.com/Plasius-LTD/ai-evals/releases/tag/v1.0.1
[1.0.2]: https://github.com/Plasius-LTD/ai-evals/releases/tag/v1.0.2
