import { describe, expect, it } from "vitest";

import {
  AI_EVALS_ENV_PREFIX,
  AI_EVALS_FEATURE_FLAG_ID,
  AI_EVALS_PACKAGE,
  packageDescriptor,
} from "../src/index.js";

describe("@plasius/ai-evals", () => {
  it("exports the package descriptor contract", () => {
    expect(packageDescriptor.packageName).toBe(AI_EVALS_PACKAGE);
    expect(packageDescriptor.featureFlagId).toBe(AI_EVALS_FEATURE_FLAG_ID);
    expect(packageDescriptor.envPrefix).toBe(AI_EVALS_ENV_PREFIX);
    expect(packageDescriptor.summary.length).toBeGreaterThan(0);
  });
});
