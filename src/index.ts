import type { AiProviderTier } from "@plasius/ai-config";

const TRUE_FLAG_VALUES = new Set(["1", "true", "t", "yes", "on", "enabled"]);

function freezeArray<T>(items: readonly T[]): readonly T[] {
  return Object.freeze([...items]);
}

function freezeRecord<T extends Record<string, unknown>>(record?: T): T | undefined {
  if (!record) {
    return undefined;
  }

  return Object.freeze({ ...record }) as T;
}

function readMaybeMetric(input: unknown): input is AiEvalMetricValue {
  return Boolean(
    input &&
      typeof input === "object" &&
      "metricId" in input &&
      "value" in input &&
      typeof (input as Record<string, unknown>).metricId === "string" &&
      typeof (input as Record<string, unknown>).value === "number"
  );
}

export interface AiPackageDescriptor {
  readonly packageName: string;
  readonly featureFlagId: string;
  readonly envPrefix: string;
  readonly summary: string;
}

export type AiEvalTaskType =
  | "moderation"
  | "player-action-validation"
  | "npc-speech"
  | "rag"
  | "routing";

export type AiEvalMetricId =
  | "quality"
  | "cost"
  | "latency"
  | "confidence"
  | "cacheSavings"
  | "safetyRegression";

export type AiEvalMetricDirection = "higher-is-better" | "lower-is-better";

export interface AiEvalMetricDefinition {
  readonly metricId: AiEvalMetricId;
  readonly direction: AiEvalMetricDirection;
  readonly unit: string;
  readonly description: string;
}

export interface AiEvalMetricThreshold {
  readonly min?: number;
  readonly max?: number;
}

export interface AiEvalMetricExpectation {
  readonly metricId: AiEvalMetricId;
  readonly threshold: AiEvalMetricThreshold;
}

export interface AiEvalFixtureCase<TInput = unknown> {
  readonly fixtureId: string;
  readonly input: TInput;
  readonly note?: string;
  readonly expectations?: readonly AiEvalMetricExpectation[];
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface AiEvalGoldenDataset<TInput = unknown> {
  readonly datasetId: string;
  readonly version: string;
  readonly name: string;
  readonly taskType: AiEvalTaskType;
  readonly baselineExpectations: readonly AiEvalMetricExpectation[];
  readonly fixtureCases: readonly AiEvalFixtureCase<TInput>[];
  readonly notes?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface AiEvalMetricValue {
  readonly metricId: AiEvalMetricId;
  readonly value: number;
}

export interface AiEvalFixtureObservation {
  readonly fixtureId: string;
  readonly metrics: readonly AiEvalMetricValue[];
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface AiEvalFixtureAdapter<TInput = unknown> {
  readonly adapterId: string;
  readonly tier: AiProviderTier;
  runFixture(fixture: AiEvalFixtureCase<TInput>): Promise<AiEvalFixtureObservation>;
}

export interface AiEvalMetricEvaluation {
  readonly metricId: AiEvalMetricId;
  readonly threshold: AiEvalMetricThreshold;
  readonly direction: AiEvalMetricDirection;
  readonly observed: number | null;
  readonly passed: boolean;
  readonly failureReason?: string;
}

export interface AiEvalFixtureResult {
  readonly fixtureId: string;
  readonly adapterId: string;
  readonly tier: AiProviderTier;
  readonly passed: boolean;
  readonly metrics: readonly AiEvalMetricEvaluation[];
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly error?: string;
}

export interface AiEvalMetricAggregate {
  readonly metricId: AiEvalMetricId;
  readonly direction: AiEvalMetricDirection;
  readonly observedCount: number;
  readonly sampleCount: number;
  readonly passCount: number;
  readonly average: number | null;
  readonly min: number | null;
  readonly max: number | null;
  readonly passRate: number;
  readonly threshold: AiEvalMetricThreshold;
}

export interface AiEvalScorecardResult {
  readonly runId: string;
  readonly status: "disabled" | "passed" | "failed" | "degraded";
  readonly datasetId: string;
  readonly version: string;
  readonly featureEnabled: boolean;
  readonly featureFlagId: string;
  readonly taskType: AiEvalTaskType;
  readonly fixtureCount: number;
  readonly executedFixtureCount: number;
  readonly passRate: number;
  readonly aggregate: readonly AiEvalMetricAggregate[];
  readonly fixtureResults: readonly AiEvalFixtureResult[];
  readonly fallbackReason?: string;
}

export interface AiEvalScorecardDelta {
  readonly metricId: AiEvalMetricId;
  readonly baselineAverage: number | null;
  readonly candidateAverage: number | null;
  readonly delta: number | null;
  readonly candidateBetter: boolean;
}

export interface AiEvalScorecardComparison {
  readonly datasetId: string;
  readonly baselineRunId: string;
  readonly candidateRunId: string;
  readonly passRateDelta: number;
  readonly metricDeltas: readonly AiEvalScorecardDelta[];
}

export interface AiEvalRunOptions<TInput = unknown> {
  readonly runId: string;
  readonly dataset: AiEvalGoldenDataset<TInput>;
  readonly adapter: AiEvalFixtureAdapter<TInput>;
  readonly featureEnabled: boolean;
}

export const AI_EVALS_PACKAGE = "@plasius/ai-evals";
export const AI_EVALS_FEATURE_FLAG_ID = "ai.evals-scorecards.enabled";
export const AI_EVALS_SCORECARDS_FEATURE_FLAG_ID = "ai.evals-scorecards.enabled";
export const AI_EVALS_ENV_PREFIX = "AI_EVALS";
export const AI_EVALS_SCORECARDS_ENV = "AI_EVALS_SCORECARDS_ENABLED";

export const AI_EVALS_METRIC_DEFINITIONS: readonly AiEvalMetricDefinition[] = freezeArray([
  {
    metricId: "quality",
    direction: "higher-is-better",
    unit: "0..1",
    description:
      "Task output quality score where 1 represents perfect quality match against fixtures.",
  },
  {
    metricId: "cost",
    direction: "lower-is-better",
    unit: "USD",
    description: "Estimated provider USD spend for fixture execution.",
  },
  {
    metricId: "latency",
    direction: "lower-is-better",
    unit: "milliseconds",
    description: "End-to-end measured latency for the fixture.",
  },
  {
    metricId: "confidence",
    direction: "higher-is-better",
    unit: "0..1",
    description: "Model confidence score associated with the fixture output.",
  },
  {
    metricId: "cacheSavings",
    direction: "higher-is-better",
    unit: "0..1",
    description: "Fraction of requests saved by cache reuse relative to fixture baseline.",
  },
  {
    metricId: "safetyRegression",
    direction: "lower-is-better",
    unit: "0..1",
    description: "Regression probability for safety-sensitive workloads compared against fixture baseline.",
  },
]);

export const AI_EVALS_TASKS: readonly AiEvalTaskType[] = Object.freeze([
  "moderation",
  "player-action-validation",
  "npc-speech",
  "rag",
  "routing",
]);

export const packageDescriptor: AiPackageDescriptor = Object.freeze({
  packageName: AI_EVALS_PACKAGE,
  featureFlagId: AI_EVALS_FEATURE_FLAG_ID,
  envPrefix: AI_EVALS_ENV_PREFIX,
  summary:
    "Golden dataset, scorecard, threshold, and regression contracts for Plasius AI evaluation workloads.",
});

const METRIC_DEFINITION_BY_ID = Object.freeze(
  AI_EVALS_METRIC_DEFINITIONS.reduce((acc, metricDefinition) => {
    acc[metricDefinition.metricId] = metricDefinition;
    return acc;
  }, {} as Record<AiEvalMetricId, AiEvalMetricDefinition>)
);

function assertNonEmptyString(value: string, label: string): void {
  if (!value || !value.trim()) {
    throw new Error(`${label} must be a non-empty string.`);
  }
}

function assertMetricThreshold(threshold: AiEvalMetricThreshold, metricId: AiEvalMetricId): void {
  if (threshold.min === undefined && threshold.max === undefined) {
    throw new Error(`Threshold for metric "${metricId}" must define at least min or max.`);
  }

  if (threshold.min !== undefined && !Number.isFinite(threshold.min)) {
    throw new Error(`Min threshold for metric "${metricId}" must be finite.`);
  }

  if (threshold.max !== undefined && !Number.isFinite(threshold.max)) {
    throw new Error(`Max threshold for metric "${metricId}" must be finite.`);
  }
}

function getMetricDefinition(metricId: AiEvalMetricId): AiEvalMetricDefinition {
  return METRIC_DEFINITION_BY_ID[metricId];
}

function isEnabledFromEnv(value: string | undefined): boolean {
  return value !== undefined && TRUE_FLAG_VALUES.has(value.trim().toLowerCase());
}

function buildMetricExpectationMap(
  baselineExpectations: readonly AiEvalMetricExpectation[],
  overrides?: readonly AiEvalMetricExpectation[]
) {
  const expectations = new Map<AiEvalMetricId, AiEvalMetricExpectation>();

  for (const expectation of baselineExpectations) {
    expectations.set(expectation.metricId, expectation);
  }

  for (const expectation of overrides ?? []) {
    expectations.set(expectation.metricId, expectation);
  }

  return expectations;
}

function evaluateMetric(
  metricId: AiEvalMetricId,
  expectation: AiEvalMetricThreshold,
  observed: number | null
) {
  const definition = getMetricDefinition(metricId);
  const direction = definition.direction;

  if (observed === null || !Number.isFinite(observed)) {
    return {
      metricId,
      threshold: expectation,
      direction,
      observed: null,
      passed: false,
      failureReason: "non-finite-metric-value",
    } satisfies AiEvalMetricEvaluation;
  }

  if (expectation.min !== undefined && observed < expectation.min) {
    return {
      metricId,
      threshold: expectation,
      direction,
      observed,
      passed: false,
      failureReason: `below-min-${expectation.min}`,
    } satisfies AiEvalMetricEvaluation;
  }

  if (expectation.max !== undefined && observed > expectation.max) {
    return {
      metricId,
      threshold: expectation,
      direction,
      observed,
      passed: false,
      failureReason: `above-max-${expectation.max}`,
    } satisfies AiEvalMetricEvaluation;
  }

  return {
    metricId,
    threshold: expectation,
    direction,
    observed,
    passed: true,
  } satisfies AiEvalMetricEvaluation;
}

function aggregateMetricResults(
  evaluationsByFixture: readonly AiEvalMetricEvaluation[],
  threshold: AiEvalMetricThreshold,
  direction: AiEvalMetricDirection,
  metricId: AiEvalMetricId
): AiEvalMetricAggregate {
  const metricValues = evaluationsByFixture
    .map((evaluation) => evaluation.observed)
    .filter((value): value is number => value !== null);

  const numericCount = metricValues.length;
  const passCount = evaluationsByFixture.filter((evaluation) => evaluation.passed).length;
  const passRate = numericCount === 0 ? 0 : passCount / numericCount;

  return Object.freeze({
    metricId,
    direction,
    observedCount: numericCount,
    sampleCount: evaluationsByFixture.length,
    passCount,
    average:
      numericCount === 0
        ? null
        : metricValues.reduce((acc, current) => acc + current, 0) / numericCount,
    min: numericCount === 0 ? null : Math.min(...metricValues),
    max: numericCount === 0 ? null : Math.max(...metricValues),
    passRate,
    threshold,
  });
}

export function isAiEvalsScorecardsEnabled(env: Record<string, string | undefined> = {}): boolean {
  return isEnabledFromEnv(env[AI_EVALS_SCORECARDS_ENV]) || isEnabledFromEnv(env[`${AI_EVALS_ENV_PREFIX}_ENABLED`]);
}

export function defineAiEvalGoldenDataset<TInput = unknown>(
  dataset: AiEvalGoldenDataset<TInput>
): AiEvalGoldenDataset<TInput> {
  assertNonEmptyString(dataset.datasetId, "datasetId");
  assertNonEmptyString(dataset.version, "version");
  assertNonEmptyString(dataset.name, "name");
  assertNonEmptyString(dataset.taskType, "taskType");

  if (dataset.fixtureCases.length === 0) {
    throw new Error("Golden dataset must include at least one fixture case.");
  }

  if (dataset.baselineExpectations.length === 0) {
    throw new Error("Golden dataset must include at least one baseline expectation.");
  }

  for (const expectation of dataset.baselineExpectations) {
    assertMetricThreshold(expectation.threshold, expectation.metricId);
    getMetricDefinition(expectation.metricId);
  }

  const fixtureIds = new Set<string>();
  const fixtureCases = dataset.fixtureCases.map((fixtureCase) => {
    assertNonEmptyString(fixtureCase.fixtureId, "fixtureId");

    if (fixtureIds.has(fixtureCase.fixtureId)) {
      throw new Error(`Duplicate fixtureId "${fixtureCase.fixtureId}" in golden dataset "${dataset.datasetId}".`);
    }

    fixtureIds.add(fixtureCase.fixtureId);

    for (const expectation of fixtureCase.expectations ?? []) {
      assertMetricThreshold(expectation.threshold, expectation.metricId);
      getMetricDefinition(expectation.metricId);
    }

    return Object.freeze({
      fixtureId: fixtureCase.fixtureId,
      input: fixtureCase.input,
      note: fixtureCase.note,
      expectations: fixtureCase.expectations
        ? freezeArray(
            fixtureCase.expectations.map((expectation) =>
              Object.freeze({
                metricId: expectation.metricId,
                threshold: expectation.threshold,
              }) as AiEvalMetricExpectation
            )
          )
        : undefined,
      metadata: freezeRecord(fixtureCase.metadata),
    });
  });

  return Object.freeze({
    datasetId: dataset.datasetId,
    version: dataset.version,
    name: dataset.name,
    taskType: dataset.taskType,
    baselineExpectations: freezeArray(
      dataset.baselineExpectations.map((expectation) => Object.freeze(expectation))
    ),
    fixtureCases: freezeArray(fixtureCases),
    notes: dataset.notes,
    metadata: freezeRecord(dataset.metadata),
  });
}

function parseMetricObservations(observation: AiEvalFixtureObservation): readonly AiEvalMetricValue[] {
  const values = observation.metrics.map((metric) => {
    if (!readMaybeMetric(metric)) {
      throw new Error(
        `Invalid metric payload for fixture "${observation.fixtureId}" from adapter output.`
      );
    }

    if (!METRIC_DEFINITION_BY_ID[metric.metricId]) {
      throw new Error(`Unknown metric "${metric.metricId}" for fixture "${observation.fixtureId}".`);
    }

    return metric;
  });

  return freezeArray(values);
}

export async function evaluateAiEvalScorecard<TInput = unknown>(
  options: AiEvalRunOptions<TInput>
): Promise<AiEvalScorecardResult> {
  const dataset = defineAiEvalGoldenDataset(options.dataset);
  const runId = options.runId.trim();
  const featureEnabled =
    options.featureEnabled ?? isAiEvalsScorecardsEnabled(process.env as Record<string, string | undefined>);

  if (!runId) {
    throw new Error("runId must be a non-empty string.");
  }

  if (!featureEnabled) {
    return Object.freeze({
      runId,
      status: "disabled",
      datasetId: dataset.datasetId,
      version: dataset.version,
      featureEnabled: false,
      featureFlagId: AI_EVALS_FEATURE_FLAG_ID,
      taskType: dataset.taskType,
      fixtureCount: dataset.fixtureCases.length,
      executedFixtureCount: 0,
      passRate: 0,
      aggregate: freezeArray([]),
      fixtureResults: freezeArray([]),
      fallbackReason: "Scorecards are disabled by feature flag.",
    });
  }

  const fixtureResults: AiEvalFixtureResult[] = [];

  for (const fixtureCase of dataset.fixtureCases) {
    try {
      const observation = await options.adapter.runFixture(fixtureCase);
      const expectedByMetric = buildMetricExpectationMap(
        dataset.baselineExpectations,
        fixtureCase.expectations
      );
      const observationByMetric = new Map<AiEvalMetricId, number>(
        parseMetricObservations(observation).map((metric) => [metric.metricId, metric.value])
      );
      const evaluations: AiEvalMetricEvaluation[] = [];

      for (const [metricId, expectation] of expectedByMetric) {
        const observedValue = observationByMetric.get(metricId) ?? null;
        const evaluation = evaluateMetric(metricId, expectation.threshold, observedValue);
        evaluations.push(Object.freeze(evaluation));
      }

      fixtureResults.push(
        Object.freeze({
          fixtureId: fixtureCase.fixtureId,
          adapterId: options.adapter.adapterId,
          tier: options.adapter.tier,
          passed: evaluations.every((evaluation) => evaluation.passed),
          metrics: freezeArray(evaluations),
          metadata: freezeRecord(observation.metadata),
        })
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown adapter failure";
      fixtureResults.push(
        Object.freeze({
          fixtureId: fixtureCase.fixtureId,
          adapterId: options.adapter.adapterId,
          tier: options.adapter.tier,
          passed: false,
          metrics: freezeArray([]),
          error: message,
        })
      );
    }
  }

  const metricsById = new Map<AiEvalMetricId, AiEvalMetricEvaluation[]>();
  for (const result of fixtureResults) {
    for (const evaluation of result.metrics) {
      const values = metricsById.get(evaluation.metricId) ?? [];
      values.push(evaluation);
      metricsById.set(evaluation.metricId, values);
    }
  }

  const aggregate = freezeArray(
    Array.from(metricsById.entries()).map(([metricId, evaluations]) =>
      aggregateMetricResults(
        evaluations,
        dataset.baselineExpectations.find(
          (expectation) => expectation.metricId === metricId
        )?.threshold ?? evaluations[0]!.threshold,
        getMetricDefinition(metricId).direction,
        metricId
      )
    )
  );

  const executedFixtureCount = fixtureResults.filter((result) => !result.error).length;
  const passedFixtureCount = fixtureResults.filter((result) => result.passed).length;
  const passRate =
    fixtureResults.length === 0 ? 0 : passedFixtureCount / fixtureResults.length;

  const status: AiEvalScorecardResult["status"] =
    executedFixtureCount < fixtureResults.length
      ? "degraded"
      : passRate === 1
        ? "passed"
        : "failed";

  return Object.freeze({
    runId,
    status,
    datasetId: dataset.datasetId,
    version: dataset.version,
    featureEnabled: true,
    featureFlagId: AI_EVALS_FEATURE_FLAG_ID,
    taskType: dataset.taskType,
    fixtureCount: dataset.fixtureCases.length,
    executedFixtureCount,
    passRate,
    aggregate,
    fixtureResults: freezeArray(fixtureResults),
  });
}

export function compareAiEvalScorecards(
  baseline: AiEvalScorecardResult,
  candidate: AiEvalScorecardResult
): AiEvalScorecardComparison {
  if (baseline.datasetId !== candidate.datasetId) {
    throw new Error(
      `Cannot compare scorecards for different datasets: "${baseline.datasetId}" vs "${candidate.datasetId}".`
    );
  }

  const metricIds = new Set<AiEvalMetricId>([
    ...baseline.aggregate.map((metric) => metric.metricId),
    ...candidate.aggregate.map((metric) => metric.metricId),
  ]);

  const metricDeltas = Array.from(metricIds, (metricId) => {
    const baselineMetric = baseline.aggregate.find((metric) => metric.metricId === metricId);
    const candidateMetric = candidate.aggregate.find((metric) => metric.metricId === metricId);
    const baselineAverage = baselineMetric?.average ?? null;
    const candidateAverage = candidateMetric?.average ?? null;
    const delta =
      baselineAverage === null || candidateAverage === null
        ? null
        : candidateAverage - baselineAverage;
    const candidateBetter =
      delta === null
        ? false
        : getMetricDefinition(metricId).direction === "higher-is-better"
          ? delta >= 0
          : delta <= 0;

    return Object.freeze({
      metricId,
      baselineAverage,
      candidateAverage,
      delta,
      candidateBetter,
    });
  });

  return Object.freeze({
    datasetId: baseline.datasetId,
    baselineRunId: baseline.runId,
    candidateRunId: candidate.runId,
    passRateDelta: candidate.passRate - baseline.passRate,
    metricDeltas: freezeArray(metricDeltas),
  });
}
