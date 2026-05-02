export interface AiPackageDescriptor {
  readonly packageName: string;
  readonly featureFlagId: string;
  readonly envPrefix: string;
  readonly summary: string;
}

export const AI_EVALS_PACKAGE = "@plasius/ai-evals";
export const AI_EVALS_FEATURE_FLAG_ID = "ai.evals.enabled";
export const AI_EVALS_ENV_PREFIX = "AI_EVALS";

export const packageDescriptor: AiPackageDescriptor = Object.freeze({
  packageName: AI_EVALS_PACKAGE,
  featureFlagId: AI_EVALS_FEATURE_FLAG_ID,
  envPrefix: AI_EVALS_ENV_PREFIX,
  summary: "Golden datasets, scorecards, and cost-quality evaluation contracts for Plasius AI workloads.",
});
