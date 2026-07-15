# ADR-0004: Project Harmony Namespace Cutover

## Status

- Accepted
- Date: 2026-07-15
- Version: 1.0

## Context

Project Harmony replaces the Isekai product namespace in one coordinated,
breaking release train. `@plasius/ai-evals` exposes two Player System rollout
keys in public constants and embeds those values in governance and Quiet Measure
dataset metadata. Retaining the old values, aliases, or dual-read behavior would
make migration state ambiguous across package consumers.

The tracked work is
[Plasius-LTD/ai-evals#41](https://github.com/Plasius-LTD/ai-evals/issues/41),
under the Project Harmony namespace Feature and its remote rollout control
`harmony.namespace-cutover.enabled`.

## Decision

- Replace `isekai.player-system.governance.enabled` with
  `harmony.player-system.governance.enabled`.
- Replace `isekai.player-system.quiet-measure.enabled` with
  `harmony.player-system.quiet-measure.enabled`.
- Publish only the Harmony values in constants and generated dataset metadata.
- Do not add aliases, dual-read parsers, environment fallback, or translation
  branches for the previous namespace.
- Release the change as the next major package version through the repository's
  approved `cd.yml` workflow.
- Keep rollout evaluation in host applications. This package continues to
  accept an explicit `featureEnabled` decision and does not evaluate the parent
  cutover flag itself.

## Rollout and rollback

The host feature-flag service is the source of truth for
`harmony.namespace-cutover.enabled`. Consumers update their stored keys and
package major during the coordinated maintenance window, then enable the flag
for the approved cohort.

Rollback requires disabling the cutover flag, restoring the coordinated
previous package majors, and applying the verified reverse stored-value
migration. This package has no persistent store of its own and therefore has no
package-local data migration.

## Consequences

- Consumers receive one canonical Harmony namespace and cannot silently rely on
  legacy values.
- The exported string-value change is intentionally SemVer-major even though
  the TypeScript symbol names remain stable.
- Evaluation fixtures and scorecard results carry Harmony rollout metadata after
  migration.
- Downstream consumers must not adopt the new major outside the coordinated
  cutover release train.
