# ADR-0003: Protected Main Release Flow

## Status

- Proposed
- Date: 2026-06-19

## Context

`@plasius/ai-evals` publishes through a protected `main` branch where direct
pushes are rejected. The prior release workflow attempted to bump
`package.json`, update `CHANGELOG.md`, and push those edits straight back to
`main` during `workflow_dispatch`.

That flow fails before tests, tagging, npm publication, or GitHub release
publication can occur, which leaves merged feature work unreleasable even when
CI passes.

## Decision

Adopt a protected-branch-safe two-step release flow:

- `workflow_dispatch` with `bump=patch|minor|major` creates a
  `release/vX.Y.Z` branch, promotes the current `Unreleased` changelog entries,
  and opens a release PR against `main`.
- Merging the release PR to `main` triggers the publish job, which tags the
  versioned commit, publishes the package to npm, and publishes the GitHub
  release.
- `workflow_dispatch` with `bump=none` remains available to publish a version
  that is already prepared on `main`.

The workflow must reconcile the highest known version across `package.json`,
published npm state, and existing git tags before preparing the next release.

## Consequences

- Package releases remain compatible with protected branch policy.
- Versioned release metadata is reviewable before publication.
- A failed or partially completed publish can be retried from prepared `main`
  metadata without rewriting package sources by hand.
