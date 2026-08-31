# ADR-0002: AI Evaluation Scorecards and Golden Dataset Contracts

## Status

- Accepted
- Date: 2026-05-13
- Clarified: 2026-08-20
- Version: 1.1

## Context

The `@plasius/ai-*` package family now needs observable evaluation behavior across AI tasks used in moderation, player action validation, NPC speech, routing, and retrieval.
Without canonical evaluation contracts, teams can validate quality or safety changes against different assumptions and compare results without deterministic baselines.

## Decision

- Implement a public `@plasius/ai-evals` contract surface that includes:
  - Golden dataset and fixture definitions (`AiEvalGoldenDataset`, `AiEvalFixtureCase`)
  - Metric contracts (`quality`, `cost`, `latency`, `confidence`, `cacheSavings`, `safetyRegression`)
  - A feature-gated scorecard runner and pass/fail evaluator (`evaluateAiEvalScorecard`)
  - Cross-run comparison primitive for cheap/dev versus premium/prod behavior (`compareAiEvalScorecards`)
  - A package-level feature flag constant plus deprecated env-name compatibility
    exports for local tooling
- Keep contracts transport-agnostic and deterministic so tests can use fixtures and fake adapters without provider credentials.
- Run scorecard evaluation only when `ai.evals-scorecards.enabled` is true, and return a documented degraded/disabled result when execution cannot be completed.
- Track metadata fields required for regression review and audit evidence instead of coupling to provider adapters directly.
- Require hosts to pass the resolved feature decision explicitly; omission
  fails closed without reading `process.env`. Deprecated env helpers remain for
  local-tooling compatibility only.
- Treat the single aggregate `threshold` as the uniform effective threshold
  applied to every included fixture sample. Uniform overrides replace the
  baseline in that aggregate; heterogeneous effective thresholds cannot be
  represented truthfully and fail dataset definition independent of fixture
  order.
- Copy and freeze threshold evidence independently for normalized datasets,
  fixture evaluations, and aggregates so caller mutation or record aliasing
  cannot rewrite an audit result.

## Consequences

- Consumers can run evaluations in CI and local pipelines with fixture-only adapters.
- Scorecard and dataset changes have explicit contracts and are testable before rollout.
- Feature gate failures and adapter-time errors are now first-class states in scorecard outputs.
- Future eval-provider implementations can evolve under the same contract without breaking caller behavior.
