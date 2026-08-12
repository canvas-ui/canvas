# Contributing to the Canvas monorepo

Contributions are welcome. This repository holds two kinds of code with two
different contribution terms — check which side your change lands on.

## `apps/*` — DCO only

The client applications (CLI, web UI, browser extensions, desktop app, shell)
are **AGPL-3.0-or-later only, for everyone, permanently**. Nothing there is
ever sublicensed, so no CLA is asked for. Sign your commits off
(`git commit -s`) to certify the [Developer Certificate of
Origin](https://developercertificate.org/), and that is all.

## `packages/*` — one-time CLA

The shared libraries (`packages/protocol`, `packages/schemas`,
`packages/api-client`, and any later additions) are part of the
**dual-licensed Canvas engine**: available under the AGPL and under the
Canvas commercial licence. Keeping that second option alive requires that the
copyright holder retain the right to license the whole codebase under terms
other than the AGPL, which a DCO does not grant.

You will therefore be asked to sign the
[Canvas CLA](https://github.com/canvas-ui/canvas-server/blob/main/CLA.md)
once. **You keep the copyright in your contribution** — it is a licence
grant, not an assignment. Comment on your first pull request touching
`packages/*` with:

```
I have read the CLA document and I hereby sign the CLA.
```

The reasoning behind the split is laid out in the server's
[CONTRIBUTING.md](https://github.com/canvas-ui/canvas-server/blob/main/CONTRIBUTING.md)
and [COMMERCIAL.md](https://github.com/canvas-ui/canvas-server/blob/main/COMMERCIAL.md).
A pull request that touches both `apps/*` and `packages/*` needs the CLA (for
the `packages/*` part) — signing it never changes the terms of your `apps/*`
work, which stays AGPL + DCO.

## Practical notes

- **Discuss large changes first.** Open an issue before a big refactor.
- **Match the surrounding code.** Comment density and naming vary by package.
- **Run the checks:** `pnpm install`, `pnpm test`, `pnpm run lint`.
- **The server lives elsewhere.** Server-side changes go to
  [canvas-server](https://github.com/canvas-ui/canvas-server); SynapsD,
  StoreD, InferD and AgentD each live in their own repository.

## Reporting security issues

Email **security@augmentd.eu** rather than opening a public issue.
