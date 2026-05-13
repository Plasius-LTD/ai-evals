import { describe, expect, it } from "vitest";

import {
  AI_EVALS_FEATURE_FLAG_ID,
  AI_EVALS_PACKAGE,
  AI_EVALS_SCORECARDS_ENABLED_ENV,
  AI_EVALS_SCORECARDS_FEATURE_FLAG_ID,
  AI_EVALS_ENV_PREFIX,
  AiEvalFixtureAdapter,
  AiEvalFixtureCase,
  AiEvalGoldenDataset,
  defineAiEvalGoldenDataset,
  evaluateAiEvalScorecard,
  compareAiEvalScorecards,
  isAiEvalsScorecardsEnabled,
  packageDescriptor,
} from "../src/index.js";

describe("@plasius/ai-evals", () => {
  it("exports the package descriptor contract", () => {
    expect(packageDescriptor.packageName).toBe(AI_EVALS_PACKAGE);
    expect(packageDescriptor.featureFlagId).toBe(AI_EVALS_FEATURE_FLAG_ID);
    expect(packageDescriptor.envPrefix).toBe(AI_EVALS_ENV_PREFIX);
    expect(packageDescriptor.summary.length).toBeGreaterThan(0);
  });

  it("uses ai.evals-scorecards.enabled as the feature-gating switch", () => {
    const env = { AI_EVALS_SCORECARDS_ENABLED: "true" };
    expect(AI_EVALS_FEATURE_FLAG_ID).toBe("ai.evals-scorecards.enabled");
    expect(AI_EVALS_SCORECARDS_FEATURE_FLAG_ID).toBe("ai.evals-scorecards.enabled");
    expect(isAiEvalsScorecardsEnabled(env)).toBe(true);
    expect(isAiEvalsScorecardsEnabled({ AI_EVALS_SCORECARDS_ENABLED: "false" })).toBe(false);
  });

  it("builds a frozen golden dataset contract and evaluates a passing scorecard", async () => {
    const dataset: AiEvalGoldenDataset<{ question: string; expected: string }> = {
      datasetId: "qa-moderation-v1",
      version: "1.0.0",
      name: "Moderation fixture set for goldens",
      taskType: "moderation",
      baselineExpectations: [
        { metricId: "quality", threshold: { min: 0.8 } },
        { metricId: "cost", threshold: { max: 5 } },
        { metricId: "latency", threshold: { max: 1800 } },
        { metricId: "confidence", threshold: { min: 0.55 } },
        { metricId: "cacheSavings", threshold: { min: 0.25 } },
        { metricId: "safetyRegression", threshold: { max: 0.03 } },
      ],
      fixtureCases: [
        {
          fixtureId: "moderation-01",
          input: { question: "Can bots edit game content?", expected: "allow" },
          note: "positive flow",
        },
        {
          fixtureId: "moderation-02",
          input: { question: "How to harm?", expected: "block" },
          note: "safety flow",
        },
      ],
    };

    const adapter: AiEvalFixtureAdapter<{ question: string; expected: string }> = {
      adapterId: "fake-evals",
      tier: "standard",
      async runFixture(fixture) {
        if (fixture.fixtureId === "moderation-01") {
          return {
            fixtureId: fixture.fixtureId,
            metrics: [
              { metricId: "quality", value: 0.98 },
              { metricId: "cost", value: 0.5 },
              { metricId: "latency", value: 450 },
              { metricId: "confidence", value: 0.74 },
              { metricId: "cacheSavings", value: 0.35 },
              { metricId: "safetyRegression", value: 0 },
            ],
          };
        }

        return {
          fixtureId: fixture.fixtureId,
          metrics: [
            { metricId: "quality", value: 0.96 },
            { metricId: "cost", value: 1.5 },
            { metricId: "latency", value: 700 },
            { metricId: "confidence", value: 0.71 },
            { metricId: "cacheSavings", value: 0.4 },
            { metricId: "safetyRegression", value: 0.005 },
          ],
        };
      },
    };

    const fixtureDataset = defineAiEvalGoldenDataset(dataset);
    const scorecard = await evaluateAiEvalScorecard({
      runId: "scorecard-qa-moderation-v1",
      dataset: fixtureDataset,
      adapter,
      featureEnabled: true,
    });

    expect(scorecard.status).toBe("passed");
    expect(scorecard.fixtureCount).toBe(2);
    expect(scorecard.executedFixtureCount).toBe(2);
    expect(scorecard.passRate).toBe(1);
    expect(scorecard.aggregate.length).toBe(6);

    const qualityAggregate = scorecard.aggregate.find((metric) => metric.metricId === "quality");
    expect(qualityAggregate?.observedCount).toBe(2);
    expect(qualityAggregate?.passRate).toBe(1);
  });

  it("returns disabled scorecards and skips adapter invocation when feature flag is off", async () => {
    const dataset: AiEvalGoldenDataset<{ input: string }> = {
      datasetId: "routing-v1",
      version: "1.0.0",
      name: "Routing fixture set",
      taskType: "routing",
      baselineExpectations: [{ metricId: "latency", threshold: { max: 1000 } }],
      fixtureCases: [
        {
          fixtureId: "route-a",
          input: { input: "foo" },
        },
      ],
    };

    let calls = 0;
    const adapter: AiEvalFixtureAdapter<{ input: string }> = {
      adapterId: "disabled-adapter",
      tier: "standard",
      async runFixture(_fixture: AiEvalFixtureCase<{ input: string }>) {
        calls += 1;
        return { fixtureId: "route-a", metrics: [{ metricId: "latency", value: 300 }] };
      },
    };

    const scorecard = await evaluateAiEvalScorecard({
      runId: "scorecard-disabled",
      dataset: defineAiEvalGoldenDataset(dataset),
      adapter,
      featureEnabled: false,
    });

    expect(scorecard.status).toBe("disabled");
    expect(scorecard.fixtureResults).toHaveLength(0);
    expect(calls).toBe(0);
    expect(scorecard.fallbackReason).toContain("disabled");
  });

  it("evaluates degraded state for fixture failures and supports run comparison", async () => {
    const dataset: AiEvalGoldenDataset<{ scenario: string; prompt: string }> = {
      datasetId: "speech-v1",
      version: "1.0.0",
      name: "NPC speech fixture set",
      taskType: "npc-speech",
      baselineExpectations: [{ metricId: "latency", threshold: { max: 500 } }],
      fixtureCases: [
        {
          fixtureId: "speech-01",
          input: { scenario: "help", prompt: "greet player" },
        },
        {
          fixtureId: "speech-02",
          input: { scenario: "combat", prompt: "call reinforcements" },
          expectations: [{ metricId: "quality", threshold: { min: 0.7 } }],
          note: "quality override",
        },
      ],
    };

    const adapterDev: AiEvalFixtureAdapter<{ scenario: string; prompt: string }> = {
      adapterId: "dev-tts",
      tier: "development",
      async runFixture(fixture) {
        if (fixture.fixtureId === "speech-01") {
          return {
            fixtureId: fixture.fixtureId,
            metrics: [{ metricId: "latency", value: 320 }],
          };
        }

        throw new Error("provider timeout");
      },
    };

    const adapterProd: AiEvalFixtureAdapter<{ scenario: string; prompt: string }> = {
      adapterId: "prod-tts",
      tier: "premium",
      async runFixture(fixture) {
        return {
          fixtureId: fixture.fixtureId,
          metrics: [
            { metricId: "latency", value: 200 },
            { metricId: "quality", value: 0.93 },
          ],
        };
      },
    };

    const devRun = await evaluateAiEvalScorecard({
      runId: "run-dev",
      dataset: defineAiEvalGoldenDataset(dataset),
      adapter: adapterDev,
      featureEnabled: true,
    });
    const prodRun = await evaluateAiEvalScorecard({
      runId: "run-prod",
      dataset: defineAiEvalGoldenDataset(dataset),
      adapter: adapterProd,
      featureEnabled: true,
    });

    expect(devRun.status).toBe("degraded");
    expect(prodRun.status).toBe("passed");
    expect(devRun.passRate).toBe(0.5);
    expect(prodRun.passRate).toBe(1);

    const comparison = compareAiEvalScorecards(devRun, prodRun);
    expect(comparison.metricDeltas).toHaveLength(2);
    const latencyDelta = comparison.metricDeltas.find((d) => d.metricId === "latency");
    expect(latencyDelta?.delta).toBeDefined();
    expect(typeof latencyDelta?.candidateBetter).toBe("boolean");
  });
});
