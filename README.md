# @plasius/ai-evals

Golden datasets, scorecards, threshold, and regression comparison contracts for Plasius AI workloads.

## Scope

This package is part of the layered `@plasius/ai-*` package family. It provides evaluator contracts, fixture definitions, and scorecard utilities used for AI quality and safety governance.

- Feature flag key: `ai.evals-scorecards.enabled`
- Package flag constant: `AI_EVALS_SCORECARDS_ENABLED`
- Runtime namespace: `AI_EVALS`

The package supports:

- Golden fixture datasets for moderation, player-action validation, NPC speech, routing, and RAG.
- Metric contracts for quality, cost, latency, confidence, cache savings, and safety regressions.
- Deterministic scorecard evaluation over fixtures and fake adapter output.
- Cross-tier scorecard comparison for development/standard/premium workflows.
- Quiet Measure fixture packs and scorecard helpers for hidden-character classification regression checks.

## Install

```bash
npm install @plasius/ai-evals
```

## Usage

```ts
import {
  AiEvalFixtureAdapter,
  AI_EVALS_FEATURE_FLAG_ID,
  AiEvalMetricExpectation,
  defineAiEvalGoldenDataset,
  evaluateAiEvalScorecard,
  isAiEvalsScorecardsEnabled,
} from "@plasius/ai-evals";

const expectations: readonly AiEvalMetricExpectation[] = [
  { metricId: "quality", threshold: { min: 0.8 } },
  { metricId: "latency", threshold: { max: 500 } },
];

const dataset = defineAiEvalGoldenDataset({
  datasetId: "example-1",
  version: "1.0.0",
  name: "Example moderation fixtures",
  taskType: "moderation",
  baselineExpectations: expectations,
  fixtureCases: [
    { fixtureId: "case-1", input: { prompt: "flag-check" } },
    { fixtureId: "case-2", input: { prompt: "safe-response" } },
  ],
});

const adapter: AiEvalFixtureAdapter<{ prompt: string }> = {
  adapterId: "fake-golden-adapter",
  tier: "development",
  async runFixture(fixture) {
    return {
      fixtureId: fixture.fixtureId,
      metrics: [
        { metricId: "quality", value: 0.93 },
        { metricId: "latency", value: 320 },
      ],
    };
  },
};

if (isAiEvalsScorecardsEnabled({ AI_EVALS_SCORECARDS_ENABLED: "true" })) {
  const scorecard = await evaluateAiEvalScorecard({
    runId: "manual-smoke",
    dataset,
    adapter,
    featureEnabled: true,
  });

  console.log(AI_EVALS_FEATURE_FLAG_ID, scorecard.status);
}
```

## Quiet Measure Fixtures

```ts
import {
  QUIET_MEASURE_GOLDEN_DATASET,
  evaluateQuietMeasureScorecard,
  type QuietMeasureFixtureAdapter,
} from "@plasius/ai-evals";

const adapter: QuietMeasureFixtureAdapter = {
  adapterId: "quiet-measure-regression",
  tier: "standard",
  async runFixture(fixture) {
    return {
      fixtureId: fixture.fixtureId,
      metrics: [
        { metricId: "quality", value: 0.91 },
        { metricId: "cost", value: 0.9 },
        { metricId: "latency", value: 320 },
        { metricId: "confidence", value: 0.8 },
        { metricId: "cacheSavings", value: 0.2 },
        { metricId: "safetyRegression", value: 0.03 },
      ],
      metadata: fixture.metadata,
    };
  },
};

const scorecard = await evaluateQuietMeasureScorecard({
  runId: "quiet-measure-smoke",
  adapter,
  featureEnabled: true,
  dataset: QUIET_MEASURE_GOLDEN_DATASET,
});
```

The Quiet Measure fixture pack publishes expected archetypes, probe shapes, and Judgment readiness boundaries for heroic, villainous, counterfeit, tyrant, and redeemed-character patterns. It does not expose host-private runtime scores, weight vectors, or disclosure decisions; those remain inside the consuming runtime.

## Development

```bash
npm install
npm run build
npm test
npm run test:coverage
npm run pack:check
```

## Governance

- Security policy: [SECURITY.md](./SECURITY.md)
- Code of conduct: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- ADRs: [docs/adrs](./docs/adrs)
- CLA and legal docs: [legal](./legal)
- Rollback guidance: disable `ai.evals-scorecards.enabled` to avoid automatic production grade evaluation runs, and rerun with known-good baseline scorecards.

## License

Apache-2.0
