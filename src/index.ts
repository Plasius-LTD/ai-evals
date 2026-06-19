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

export const AI_EVALS_QUIET_MEASURE_FEATURE_FLAG_ID =
  "isekai.player-system.quiet-measure.enabled";

export const QUIET_MEASURE_CLASSIFICATION_PATTERNS = [
  "heroic",
  "villainous",
  "counterfeit-hero",
  "counterfeit-villain",
  "tyrant",
  "redeemed-character",
] as const;

export type QuietMeasureClassificationPattern =
  (typeof QUIET_MEASURE_CLASSIFICATION_PATTERNS)[number];

export const QUIET_MEASURE_SIGNAL_LEVELS = [
  "suppressed",
  "latent",
  "present",
  "dominant",
] as const;

export type QuietMeasureSignalLevel =
  (typeof QUIET_MEASURE_SIGNAL_LEVELS)[number];

export const QUIET_MEASURE_PRIVATE_CONDUCT_PATTERNS = [
  "protective",
  "predatory",
  "performative",
  "repentant",
] as const;

export type QuietMeasurePrivateConductPattern =
  (typeof QUIET_MEASURE_PRIVATE_CONDUCT_PATTERNS)[number];

export const QUIET_MEASURE_PRESSURE_RESPONSES = [
  "merciful",
  "exploitative",
  "mixed",
  "restitutive",
] as const;

export type QuietMeasurePressureResponse =
  (typeof QUIET_MEASURE_PRESSURE_RESPONSES)[number];

export const QUIET_MEASURE_REPAIR_PATTERNS = [
  "none",
  "token",
  "costly",
] as const;

export type QuietMeasureRepairPattern =
  (typeof QUIET_MEASURE_REPAIR_PATTERNS)[number];

export const QUIET_MEASURE_DERIVED_READS = [
  "nature",
  "mask",
  "veil-gap",
  "restitution",
] as const;

export type QuietMeasureDerivedRead =
  (typeof QUIET_MEASURE_DERIVED_READS)[number];

export const QUIET_MEASURE_PROBE_MODES = [
  "clarify",
  "tempt",
  "reinforce",
] as const;

export type QuietMeasureProbeMode =
  (typeof QUIET_MEASURE_PROBE_MODES)[number];

export const QUIET_MEASURE_RESOLUTION_SHAPES = [
  "restorative",
  "dominant",
  "detached",
  "performative",
] as const;

export type QuietMeasureResolutionShape =
  (typeof QUIET_MEASURE_RESOLUTION_SHAPES)[number];

export const QUIET_MEASURE_JUDGMENT_STATES = [
  "insufficient-evidence",
  "eligible",
] as const;

export type QuietMeasureJudgmentState =
  (typeof QUIET_MEASURE_JUDGMENT_STATES)[number];

export const QUIET_MEASURE_OUTCOME_BIASES = [
  "virtue-compounding",
  "vice-viable",
  "ambiguity-preserving",
] as const;

export type QuietMeasureOutcomeBias =
  (typeof QUIET_MEASURE_OUTCOME_BIASES)[number];

export interface QuietMeasureFixtureInput {
  readonly synopsis: string;
  readonly publicCourtesy: QuietMeasureSignalLevel;
  readonly mercy: QuietMeasureSignalLevel;
  readonly reciprocity: QuietMeasureSignalLevel;
  readonly principledConduct: QuietMeasureSignalLevel;
  readonly privateConduct: QuietMeasurePrivateConductPattern;
  readonly costlyPressureResponse: QuietMeasurePressureResponse;
  readonly repairAfterHarm: QuietMeasureRepairPattern;
}

export type QuietMeasureFixtureMetadata = Readonly<Record<string, unknown>> & {
  readonly expectedArchetype: QuietMeasureClassificationPattern;
  readonly expectedJudgmentState: QuietMeasureJudgmentState;
  readonly expectedProbeMode: QuietMeasureProbeMode;
  readonly expectedResolutionShape: QuietMeasureResolutionShape;
  readonly expectedOutcomeBias: QuietMeasureOutcomeBias;
  readonly expectedDominantReads: readonly QuietMeasureDerivedRead[];
  readonly boundaryNote: string;
};

export interface QuietMeasureFixtureCase
  extends AiEvalFixtureCase<QuietMeasureFixtureInput> {
  readonly metadata?: QuietMeasureFixtureMetadata;
}

export interface QuietMeasureFixtureAdapter {
  readonly adapterId: string;
  readonly tier: AiProviderTier;
  runFixture(fixture: QuietMeasureFixtureCase): Promise<AiEvalFixtureObservation>;
}

export const PLAYER_SYSTEM_GOVERNANCE_FEATURE_FLAG_ID =
  "isekai.player-system.governance.enabled";

export const PLAYER_SYSTEM_GOVERNANCE_SCORECARD_IDS = [
  "tutorial-usefulness",
  "mission-fit",
  "preference-learning",
  "voice-intent",
  "reward-boundedness",
] as const;

export type PlayerSystemGovernanceScorecardId =
  (typeof PLAYER_SYSTEM_GOVERNANCE_SCORECARD_IDS)[number];

export type PlayerSystemGovernanceSurface =
  | "tutorial"
  | "missions"
  | "preference-learning"
  | "voice"
  | "reward-governance";

export interface PlayerSystemGovernanceFixtureInput {
  readonly synopsis: string;
  readonly playerStage: "awakening" | "institutional" | "advanced";
  readonly surface: PlayerSystemGovernanceSurface;
  readonly observedOutcome: string;
  readonly authorityBoundary: string;
  readonly expectedWarnings: readonly string[];
}

export type PlayerSystemGovernanceFixtureMetadata =
  Readonly<Record<string, unknown>> & {
    readonly scorecardId: PlayerSystemGovernanceScorecardId;
    readonly supportedTiers: readonly AiProviderTier[];
    readonly inheritedFeatureFlagId: string;
    readonly authorityBoundary: string;
    readonly feedbackLoopSummary: string;
  };

export interface PlayerSystemGovernanceFixtureCase
  extends AiEvalFixtureCase<PlayerSystemGovernanceFixtureInput> {
  readonly metadata?: PlayerSystemGovernanceFixtureMetadata;
}

export interface PlayerSystemGovernanceFixtureAdapter
  extends Omit<AiEvalFixtureAdapter<PlayerSystemGovernanceFixtureInput>, "runFixture"> {
  runFixture(fixture: PlayerSystemGovernanceFixtureCase): Promise<AiEvalFixtureObservation>;
}

export const AI_EVALS_PACKAGE = "@plasius/ai-evals";
export const AI_EVALS_FEATURE_FLAG_ID = "ai.evals-scorecards.enabled";
export const AI_EVALS_SCORECARDS_FEATURE_FLAG_ID = "ai.evals-scorecards.enabled";
export const AI_EVALS_ENV_PREFIX = "AI_EVALS";
export const AI_EVALS_SCORECARDS_ENV = "AI_EVALS_SCORECARDS_ENABLED";
export const AI_EVALS_SCORECARDS_ENABLED_ENV = AI_EVALS_SCORECARDS_ENV;

export const QUIET_MEASURE_FIXTURE_CASES: readonly QuietMeasureFixtureCase[] = freezeArray([
  {
    fixtureId: "quiet-measure-heroic-route",
    input: {
      synopsis:
        "Protects weak travelers at personal cost, shares scarce supplies, and keeps mercy steady under pressure.",
      publicCourtesy: "present",
      mercy: "dominant",
      reciprocity: "present",
      principledConduct: "present",
      privateConduct: "protective",
      costlyPressureResponse: "merciful",
      repairAfterHarm: "costly",
    },
    note:
      "Heroic pattern where mercy and reciprocity matter more than surface politeness.",
    metadata: {
      expectedArchetype: "heroic",
      expectedJudgmentState: "eligible",
      expectedProbeMode: "reinforce",
      expectedResolutionShape: "restorative",
      expectedOutcomeBias: "virtue-compounding",
      expectedDominantReads: ["nature"],
      boundaryNote:
        "Public fixtures name the expected archetype and probe shape only; raw host-private score storage stays out of this package.",
    },
  },
  {
    fixtureId: "quiet-measure-villainous-route",
    input: {
      synopsis:
        "Extracts tribute, hoards safety, and treats weakness as leverage while staying strategically polite when observed.",
      publicCourtesy: "present",
      mercy: "suppressed",
      reciprocity: "latent",
      principledConduct: "latent",
      privateConduct: "predatory",
      costlyPressureResponse: "exploitative",
      repairAfterHarm: "none",
    },
    note:
      "Villainous pattern remains viable, but should not out-compound restorative surplus over time.",
    metadata: {
      expectedArchetype: "villainous",
      expectedJudgmentState: "eligible",
      expectedProbeMode: "tempt",
      expectedResolutionShape: "dominant",
      expectedOutcomeBias: "vice-viable",
      expectedDominantReads: ["nature"],
      boundaryNote:
        "The scorecard should treat darker paths as valid classifications without rewarding them above restorative long-horizon outcomes.",
    },
  },
  {
    fixtureId: "quiet-measure-counterfeit-hero",
    input: {
      synopsis:
        "Performs elaborate manners and public generosity while privately exploiting dependents and evading costly mercy.",
      publicCourtesy: "dominant",
      mercy: "suppressed",
      reciprocity: "latent",
      principledConduct: "latent",
      privateConduct: "performative",
      costlyPressureResponse: "exploitative",
      repairAfterHarm: "token",
    },
    note:
      "Counterfeit-hero pattern that should fail if courtesy is allowed to dominate mercy and principle.",
    metadata: {
      expectedArchetype: "counterfeit-hero",
      expectedJudgmentState: "eligible",
      expectedProbeMode: "clarify",
      expectedResolutionShape: "performative",
      expectedOutcomeBias: "ambiguity-preserving",
      expectedDominantReads: ["mask", "veil-gap"],
      boundaryNote:
        "Courtesy alone is insufficient; the public fixture exists to catch hosts that mistake polished manners for restorative character.",
    },
  },
  {
    fixtureId: "quiet-measure-counterfeit-villain",
    input: {
      synopsis:
        "Looks rough and threatening in public, but repeatedly shields weaker parties, keeps bargains, and refuses easy cruelty in private.",
      publicCourtesy: "suppressed",
      mercy: "present",
      reciprocity: "present",
      principledConduct: "present",
      privateConduct: "protective",
      costlyPressureResponse: "mixed",
      repairAfterHarm: "token",
    },
    note:
      "Counterfeit-villain pattern protects rough-hero play from being flattened into vice.",
    metadata: {
      expectedArchetype: "counterfeit-villain",
      expectedJudgmentState: "eligible",
      expectedProbeMode: "clarify",
      expectedResolutionShape: "detached",
      expectedOutcomeBias: "ambiguity-preserving",
      expectedDominantReads: ["mask", "nature"],
      boundaryNote:
        "Visible harshness must not erase repeated protective conduct in the public fixture interpretation.",
    },
  },
  {
    fixtureId: "quiet-measure-tyrant-route",
    input: {
      synopsis:
        "Builds order through fear, centralizes power, and accepts obedience gains despite brittle downstream trust.",
      publicCourtesy: "latent",
      mercy: "suppressed",
      reciprocity: "suppressed",
      principledConduct: "present",
      privateConduct: "predatory",
      costlyPressureResponse: "exploitative",
      repairAfterHarm: "none",
    },
    note:
      "Tyrant pattern should remain classifiable and playable without overtaking restorative compounding in aggregate comparisons.",
    metadata: {
      expectedArchetype: "tyrant",
      expectedJudgmentState: "eligible",
      expectedProbeMode: "reinforce",
      expectedResolutionShape: "dominant",
      expectedOutcomeBias: "vice-viable",
      expectedDominantReads: ["nature"],
      boundaryNote:
        "The public fixture allows tyrant outcomes to stay valid while still marking them as brittle rather than surplus-generating.",
    },
  },
  {
    fixtureId: "quiet-measure-redeemed-turn",
    input: {
      synopsis:
        "After causing harm, accepts costly restitution, protects former victims in private, and changes conduct under renewed pressure.",
      publicCourtesy: "present",
      mercy: "present",
      reciprocity: "dominant",
      principledConduct: "present",
      privateConduct: "repentant",
      costlyPressureResponse: "restitutive",
      repairAfterHarm: "costly",
    },
    note:
      "Redeemed-character pattern must preserve restitution-driven turns as first-class outcomes.",
    metadata: {
      expectedArchetype: "redeemed-character",
      expectedJudgmentState: "eligible",
      expectedProbeMode: "reinforce",
      expectedResolutionShape: "restorative",
      expectedOutcomeBias: "virtue-compounding",
      expectedDominantReads: ["restitution", "nature"],
      boundaryNote:
        "Redemption fixtures expose the public expectation for costly repair without disclosing internal host-private weight vectors.",
    },
  },
]);

export const QUIET_MEASURE_BASELINE_EXPECTATIONS: readonly AiEvalMetricExpectation[] =
  freezeArray([
    { metricId: "quality", threshold: { min: 0.8 } },
    { metricId: "cost", threshold: { max: 3 } },
    { metricId: "latency", threshold: { max: 1500 } },
    { metricId: "confidence", threshold: { min: 0.65 } },
    { metricId: "cacheSavings", threshold: { min: 0.1 } },
    { metricId: "safetyRegression", threshold: { max: 0.08 } },
  ]);

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

export const QUIET_MEASURE_GOLDEN_DATASET = defineAiEvalGoldenDataset<QuietMeasureFixtureInput>({
  datasetId: "quiet-measure-classification-v1",
  version: "1.0.0",
  name: "Quiet Measure classification and Judgment fixture pack",
  taskType: "player-action-validation",
  baselineExpectations: QUIET_MEASURE_BASELINE_EXPECTATIONS,
  fixtureCases: QUIET_MEASURE_FIXTURE_CASES,
  notes:
    "These fixtures publish archetype and probe expectations for Quiet Measure scorecards while keeping host-private runtime scores and weights outside the package boundary.",
  metadata: {
    inheritedFeatureFlagId: AI_EVALS_QUIET_MEASURE_FEATURE_FLAG_ID,
    interpretationBoundary:
      "Public fixtures expose expected archetypes, probe shapes, and outcome tendencies only; hosts retain raw scoring, per-player evidence windows, and disclosure decisions.",
  },
});

const PLAYER_SYSTEM_GOVERNANCE_SUPPORTED_TIERS = freezeArray([
  "development",
  "standard",
  "premium",
] satisfies readonly AiProviderTier[]);

function createPlayerSystemGovernanceDataset(options: {
  readonly scorecardId: PlayerSystemGovernanceScorecardId;
  readonly version: string;
  readonly name: string;
  readonly baselineExpectations: readonly AiEvalMetricExpectation[];
  readonly fixtureCases: readonly PlayerSystemGovernanceFixtureCase[];
  readonly notes: string;
}): AiEvalGoldenDataset<PlayerSystemGovernanceFixtureInput> {
  return defineAiEvalGoldenDataset<PlayerSystemGovernanceFixtureInput>({
    datasetId: `player-system-${options.scorecardId}-v1`,
    version: options.version,
    name: options.name,
    taskType: "player-action-validation",
    baselineExpectations: options.baselineExpectations,
    fixtureCases: options.fixtureCases,
    notes: options.notes,
    metadata: {
      inheritedFeatureFlagId: PLAYER_SYSTEM_GOVERNANCE_FEATURE_FLAG_ID,
      scorecardId: options.scorecardId,
      supportedTiers: PLAYER_SYSTEM_GOVERNANCE_SUPPORTED_TIERS,
    },
  });
}

export const PLAYER_SYSTEM_GOVERNANCE_GOLDEN_DATASETS = Object.freeze({
  "tutorial-usefulness": createPlayerSystemGovernanceDataset({
    scorecardId: "tutorial-usefulness",
    version: "1.0.0",
    name: "Player System tutorial usefulness scorecard fixtures",
    baselineExpectations: freezeArray([
      { metricId: "quality", threshold: { min: 0.82 } },
      { metricId: "latency", threshold: { max: 1400 } },
      { metricId: "confidence", threshold: { min: 0.72 } },
      { metricId: "safetyRegression", threshold: { max: 0.04 } },
    ]),
    fixtureCases: freezeArray([
      {
        fixtureId: "tutorial-awakening-recovery-window",
        input: {
          synopsis:
            "Awakening guidance reappears immediately after the player exits danger instead of several interactions later.",
          playerStage: "awakening",
          surface: "tutorial",
          observedOutcome: "Coaching resumed within one safe shell transition.",
          authorityBoundary: "Tutorial shell may recommend, but world authority still owns progression.",
          expectedWarnings: [],
        },
        note:
          "Catches regressions where tutorial prompts appear after the teachable moment has already passed.",
        metadata: {
          scorecardId: "tutorial-usefulness",
          supportedTiers: PLAYER_SYSTEM_GOVERNANCE_SUPPORTED_TIERS,
          inheritedFeatureFlagId: PLAYER_SYSTEM_GOVERNANCE_FEATURE_FLAG_ID,
          authorityBoundary:
            "Tutorial shell may recommend, but world authority still owns progression.",
          feedbackLoopSummary:
            "Measures whether tutorial interventions stay close to the triggering moment.",
        },
      },
      {
        fixtureId: "tutorial-advanced-track-guard",
        input: {
          synopsis:
            "Advanced coaching stays blocked until prerequisites are complete and the shell explains the missing institution gate.",
          playerStage: "institutional",
          surface: "tutorial",
          observedOutcome: "The player receives a blocked-prerequisite explanation instead of a premature unlock.",
          authorityBoundary: "Schools and barracks remain the unlock authority.",
          expectedWarnings: ["institution-gate-required"],
        },
        note:
          "Prevents tutorial usefulness from being overstated by unlocking routes the player cannot actually enter.",
        metadata: {
          scorecardId: "tutorial-usefulness",
          supportedTiers: PLAYER_SYSTEM_GOVERNANCE_SUPPORTED_TIERS,
          inheritedFeatureFlagId: PLAYER_SYSTEM_GOVERNANCE_FEATURE_FLAG_ID,
          authorityBoundary: "Schools and barracks remain the unlock authority.",
          feedbackLoopSummary:
            "Measures whether blocked coaching still stays useful through explicit explanation.",
        },
      },
    ]),
    notes:
      "Tutorial usefulness fixtures validate that governance hooks can measure timeliness and prerequisite-safe coaching without granting authority.",
  }),
  "mission-fit": createPlayerSystemGovernanceDataset({
    scorecardId: "mission-fit",
    version: "1.0.0",
    name: "Player System mission-fit scorecard fixtures",
    baselineExpectations: freezeArray([
      { metricId: "quality", threshold: { min: 0.84 } },
      { metricId: "confidence", threshold: { min: 0.74 } },
      { metricId: "latency", threshold: { max: 1500 } },
      { metricId: "safetyRegression", threshold: { max: 0.04 } },
    ]),
    fixtureCases: freezeArray([
      {
        fixtureId: "mission-fit-civic-readiness",
        input: {
          synopsis:
            "The shell recommends a civic-duty quest that matches the current authority band and avoids later-stage power skips.",
          playerStage: "institutional",
          surface: "missions",
          observedOutcome: "Accepted route stays inside civic readiness and does not bypass training authority.",
          authorityBoundary: "Guild and institution contracts still decide actual reward truth.",
          expectedWarnings: [],
        },
        metadata: {
          scorecardId: "mission-fit",
          supportedTiers: PLAYER_SYSTEM_GOVERNANCE_SUPPORTED_TIERS,
          inheritedFeatureFlagId: PLAYER_SYSTEM_GOVERNANCE_FEATURE_FLAG_ID,
          authorityBoundary:
            "Guild and institution contracts still decide actual reward truth.",
          feedbackLoopSummary:
            "Measures whether recommended missions match readiness instead of forcing power skips.",
        },
      },
      {
        fixtureId: "mission-fit-misleading-escalation",
        input: {
          synopsis:
            "The shell surfaces a mission preview but must warn that academy authority has not yet cleared the specialization gate.",
          playerStage: "advanced",
          surface: "missions",
          observedOutcome: "Preview shown, grant blocked, warning retained.",
          authorityBoundary: "Academy specialization remains authoritative.",
          expectedWarnings: ["institution-confirmation-pending"],
        },
        metadata: {
          scorecardId: "mission-fit",
          supportedTiers: PLAYER_SYSTEM_GOVERNANCE_SUPPORTED_TIERS,
          inheritedFeatureFlagId: PLAYER_SYSTEM_GOVERNANCE_FEATURE_FLAG_ID,
          authorityBoundary: "Academy specialization remains authoritative.",
          feedbackLoopSummary:
            "Measures whether mission previews remain honest when institutional authority has not yet cleared the route.",
        },
      },
    ]),
    notes:
      "Mission-fit fixtures measure whether recommended work stays within the player's current readiness and authority boundary.",
  }),
  "preference-learning": createPlayerSystemGovernanceDataset({
    scorecardId: "preference-learning",
    version: "1.0.0",
    name: "Player System preference-learning scorecard fixtures",
    baselineExpectations: freezeArray([
      { metricId: "quality", threshold: { min: 0.8 } },
      { metricId: "confidence", threshold: { min: 0.7 } },
      { metricId: "cacheSavings", threshold: { min: 0.05 } },
      { metricId: "safetyRegression", threshold: { max: 0.04 } },
    ]),
    fixtureCases: freezeArray([
      {
        fixtureId: "preference-learning-governance-bias",
        input: {
          synopsis:
            "Recent accept and complete actions keep reinforcing a governance-heavy mission bias.",
          playerStage: "institutional",
          surface: "preference-learning",
          observedOutcome: "Preference branch remains coherent across the last several accepted missions.",
          authorityBoundary: "The shell may learn from behavior but cannot grant rank or unlocks.",
          expectedWarnings: [],
        },
        metadata: {
          scorecardId: "preference-learning",
          supportedTiers: PLAYER_SYSTEM_GOVERNANCE_SUPPORTED_TIERS,
          inheritedFeatureFlagId: PLAYER_SYSTEM_GOVERNANCE_FEATURE_FLAG_ID,
          authorityBoundary:
            "The shell may learn from behavior but cannot grant rank or unlocks.",
          feedbackLoopSummary:
            "Measures whether preference learning remains coherent without overruling world authority.",
        },
      },
      {
        fixtureId: "preference-learning-branch-drift",
        input: {
          synopsis:
            "Mixed recent behavior forces the shell to flag branch drift instead of pretending one route is clearly dominant.",
          playerStage: "advanced",
          surface: "preference-learning",
          observedOutcome: "Preference drift warning retained for human review.",
          authorityBoundary: "Preference summaries remain advisory only.",
          expectedWarnings: ["manual-review-for-drift"],
        },
        metadata: {
          scorecardId: "preference-learning",
          supportedTiers: PLAYER_SYSTEM_GOVERNANCE_SUPPORTED_TIERS,
          inheritedFeatureFlagId: PLAYER_SYSTEM_GOVERNANCE_FEATURE_FLAG_ID,
          authorityBoundary: "Preference summaries remain advisory only.",
          feedbackLoopSummary:
            "Measures whether the learning loop admits uncertainty instead of overfitting noisy behavior.",
        },
      },
    ]),
    notes:
      "Preference-learning fixtures measure branch coherence and drift handling for governance-guided mission shaping.",
  }),
  "voice-intent": createPlayerSystemGovernanceDataset({
    scorecardId: "voice-intent",
    version: "1.0.0",
    name: "Player System voice-intent scorecard fixtures",
    baselineExpectations: freezeArray([
      { metricId: "quality", threshold: { min: 0.84 } },
      { metricId: "latency", threshold: { max: 900 } },
      { metricId: "confidence", threshold: { min: 0.78 } },
      { metricId: "safetyRegression", threshold: { max: 0.03 } },
    ]),
    fixtureCases: freezeArray([
      {
        fixtureId: "voice-intent-clean-resolution",
        input: {
          synopsis:
            "A spoken request to inspect the next training surface resolves without manual repair.",
          playerStage: "institutional",
          surface: "voice",
          observedOutcome: "Intent resolved directly to a bounded training-routing explanation.",
          authorityBoundary: "Voice intents may navigate or explain, but not mutate authority-owned state.",
          expectedWarnings: [],
        },
        metadata: {
          scorecardId: "voice-intent",
          supportedTiers: PLAYER_SYSTEM_GOVERNANCE_SUPPORTED_TIERS,
          inheritedFeatureFlagId: PLAYER_SYSTEM_GOVERNANCE_FEATURE_FLAG_ID,
          authorityBoundary:
            "Voice intents may navigate or explain, but not mutate authority-owned state.",
          feedbackLoopSummary:
            "Measures whether spoken intents classify safely without extra clarification.",
        },
      },
      {
        fixtureId: "voice-intent-manual-fallback",
        input: {
          synopsis:
            "A noisy overdrive request requires clarification and then falls back to manual confirmation.",
          playerStage: "advanced",
          surface: "voice",
          observedOutcome: "Manual fallback preserved instead of forcing a risky classification.",
          authorityBoundary: "Manual confirmation remains authoritative when speech confidence drops.",
          expectedWarnings: ["manual-confirmation-required"],
        },
        metadata: {
          scorecardId: "voice-intent",
          supportedTiers: PLAYER_SYSTEM_GOVERNANCE_SUPPORTED_TIERS,
          inheritedFeatureFlagId: PLAYER_SYSTEM_GOVERNANCE_FEATURE_FLAG_ID,
          authorityBoundary:
            "Manual confirmation remains authoritative when speech confidence drops.",
          feedbackLoopSummary:
            "Measures whether the shell fails closed on ambiguous voice requests.",
        },
      },
    ]),
    notes:
      "Voice-intent fixtures measure safe classification, clarification rate, and manual fallback behavior for spoken governance flows.",
  }),
  "reward-boundedness": createPlayerSystemGovernanceDataset({
    scorecardId: "reward-boundedness",
    version: "1.0.0",
    name: "Player System reward-boundedness scorecard fixtures",
    baselineExpectations: freezeArray([
      { metricId: "quality", threshold: { min: 0.88 } },
      { metricId: "confidence", threshold: { min: 0.8 } },
      { metricId: "latency", threshold: { max: 1100 } },
      { metricId: "safetyRegression", threshold: { max: 0.02 } },
    ]),
    fixtureCases: freezeArray([
      {
        fixtureId: "reward-boundedness-approved-preview",
        input: {
          synopsis:
            "A mission reward preview stays within global and session caps and waits for the external authority grant.",
          playerStage: "institutional",
          surface: "reward-governance",
          observedOutcome: "Preview shown without exceeding caps or bypassing the guild reward grant.",
          authorityBoundary: "Guild reward truth remains authoritative.",
          expectedWarnings: [],
        },
        metadata: {
          scorecardId: "reward-boundedness",
          supportedTiers: PLAYER_SYSTEM_GOVERNANCE_SUPPORTED_TIERS,
          inheritedFeatureFlagId: PLAYER_SYSTEM_GOVERNANCE_FEATURE_FLAG_ID,
          authorityBoundary: "Guild reward truth remains authoritative.",
          feedbackLoopSummary:
            "Measures whether reward previews remain bounded and authority-safe.",
        },
      },
      {
        fixtureId: "reward-boundedness-cap-pressure",
        input: {
          synopsis:
            "The shell warns that a trust-surplus preview is one grant away from the session cap and blocks duplicate minting.",
          playerStage: "advanced",
          surface: "reward-governance",
          observedOutcome: "Reward remains blocked with cap and duplicate-ledger warnings intact.",
          authorityBoundary: "The shell may warn, but cannot self-grant around caps.",
          expectedWarnings: [
            "session-cap-nearly-exhausted",
            "duplicate-ledger-blocked",
          ],
        },
        metadata: {
          scorecardId: "reward-boundedness",
          supportedTiers: PLAYER_SYSTEM_GOVERNANCE_SUPPORTED_TIERS,
          inheritedFeatureFlagId: PLAYER_SYSTEM_GOVERNANCE_FEATURE_FLAG_ID,
          authorityBoundary: "The shell may warn, but cannot self-grant around caps.",
          feedbackLoopSummary:
            "Measures whether bounded reward checks fail closed before unsafe grants.",
        },
      },
    ]),
    notes:
      "Reward-boundedness fixtures measure cap pressure, duplicate-grant protection, and authority-safe preview behavior.",
  }),
} satisfies Record<
  PlayerSystemGovernanceScorecardId,
  AiEvalGoldenDataset<PlayerSystemGovernanceFixtureInput>
>);

export function getPlayerSystemGovernanceGoldenDataset(
  scorecardId: PlayerSystemGovernanceScorecardId
): AiEvalGoldenDataset<PlayerSystemGovernanceFixtureInput> {
  return PLAYER_SYSTEM_GOVERNANCE_GOLDEN_DATASETS[scorecardId];
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

export async function evaluateQuietMeasureScorecard(
  options: Omit<AiEvalRunOptions<QuietMeasureFixtureInput>, "dataset"> & {
    readonly dataset?: AiEvalGoldenDataset<QuietMeasureFixtureInput>;
    readonly adapter: QuietMeasureFixtureAdapter;
  },
): Promise<AiEvalScorecardResult> {
  return evaluateAiEvalScorecard({
    ...options,
    adapter: {
      adapterId: options.adapter.adapterId,
      tier: options.adapter.tier,
      runFixture: (fixture) =>
        options.adapter.runFixture(fixture as QuietMeasureFixtureCase),
    },
    dataset: options.dataset ?? QUIET_MEASURE_GOLDEN_DATASET,
  });
}

export async function evaluatePlayerSystemGovernanceScorecard(
  options: Omit<AiEvalRunOptions<PlayerSystemGovernanceFixtureInput>, "dataset"> & {
    readonly scorecardId: PlayerSystemGovernanceScorecardId;
    readonly dataset?: AiEvalGoldenDataset<PlayerSystemGovernanceFixtureInput>;
    readonly adapter: PlayerSystemGovernanceFixtureAdapter;
  }
): Promise<AiEvalScorecardResult> {
  return evaluateAiEvalScorecard({
    ...options,
    adapter: {
      adapterId: options.adapter.adapterId,
      tier: options.adapter.tier,
      runFixture: (fixture) =>
        options.adapter.runFixture(fixture as PlayerSystemGovernanceFixtureCase),
    },
    dataset:
      options.dataset
      ?? getPlayerSystemGovernanceGoldenDataset(options.scorecardId),
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
