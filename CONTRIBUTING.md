# Contributing to canvas-common

Contributions are welcome. Canvas has two kinds of code with two different
contribution terms — check which side your change lands on.

## Client applications — DCO only

The client applications (CLI and shell, web UI, browser extensions, desktop
app — each in its own repository now, formerly `apps/*` here) are
**AGPL-3.0-or-later only, for everyone, permanently**. Nothing there is
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

A status check enforces this automatically on pull requests touching
`packages/*`: the CLA bot posts instructions, records your signature (once,
against your GitHub account) and unblocks the check.

The reasoning behind the split is laid out in the server's
[CONTRIBUTING.md](https://github.com/canvas-ui/canvas-server/blob/main/CONTRIBUTING.md)
and [COMMERCIAL.md](https://github.com/canvas-ui/canvas-server/blob/main/COMMERCIAL.md).
Signing it never changes the terms of your work on the client applications,
which stays AGPL + DCO.

## Practical notes

- **Discuss large changes first.** Open an issue before a big refactor.
- **Match the surrounding code.** Comment density and naming vary by package.
- **Run the checks:** `pnpm install`, `pnpm test`, `pnpm run lint`.
- **The server lives elsewhere.** Server-side changes go to
  [canvas-server](https://github.com/canvas-ui/canvas-server); SynapsD,
  StoreD, InferD and AgentD each live in their own repository.

## Reporting security issues

Email **security@augmentd.eu** rather than opening a public issue.
