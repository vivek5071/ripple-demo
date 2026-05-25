# ripple-demo

Demo repo for [Ripple](https://github.com/vivek5071/ripple) — a GitHub Action that detects downstream-impacted files on PRs and routes review requests to the right owners automatically.

## What this repo demonstrates

This is a small TypeScript project with a realistic file dependency graph:

```
src/api/users.ts          ← exports getUserById, getUserByEmail, createUser
    ↑ imported by
src/api/payments.ts       ← uses getUserById to validate user before payment
src/services/auth-service.ts     ← uses getUserById, getUserByEmail for login/session
src/services/notification-service.ts  ← uses getUserById to send emails
```

When a PR changes `src/api/users.ts`, Ripple detects all three downstream files and notifies their owners — even though those files weren't touched by the PR.

## How to reproduce

1. Fork this repo
2. Open a PR that modifies `src/api/users.ts`
3. Watch Ripple post a comment listing the downstream files that could break

## Ownership

See [`.ripple.yml`](.ripple.yml) for the ownership map.
