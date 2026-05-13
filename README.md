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
