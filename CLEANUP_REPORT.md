# Cleanup Report

## Scope
This cleanup pass focused on files that are clearly historical, one-off, or not involved in the running Next.js app, Railway deployment, Stripe flow, or database sync path.

## Files reviewed
- [test-sync.js](test-sync.js) — one-off database probe, not referenced by app or scripts.
- [check-stripe.js](check-stripe.js) — hard-coded Stripe/Netlify probe, not referenced by runtime or deployment.
- [remove-mockups.py](remove-mockups.py) — one-off data mutation script, not used by build or runtime.
- [delete-mockups.sed](delete-mockups.sed) — one-off sed patch script, not used by build or runtime.
- [next.config.js](next.config.js) — legacy duplicate config; [next.config.ts](next.config.ts) is the active Railway-compatible config.
- [next.config.embed-reviews.mjs](next.config.embed-reviews.mjs) — experimental post-build script; not wired into build or deployment.
- [src/lib/data/products.ts.backup](src/lib/data/products.ts.backup) — backup copy of product data; not used by runtime.
- [ADMIN-PRICES.md](ADMIN-PRICES.md) — historical admin pricing note; not used by app or deployment.
- [AUDIT_REPORT_FINAL.md](AUDIT_REPORT_FINAL.md) — historical audit artifact; not used by app or deployment.
- [AUDIT_SUMMARY.md](AUDIT_SUMMARY.md) — historical audit artifact; not used by app or deployment.
- [TEST_REPORT.md](TEST_REPORT.md) — historical test report; not used by app or deployment.
- [PLACEHOLDER_IMAGES.md](PLACEHOLDER_IMAGES.md) — documentation artifact; not used by runtime.
- [PRICE-SYNC.md](PRICE-SYNC.md) — historical price sync note; not used by app or deployment.
- [HAIKU_NEXT_TASKS.md](HAIKU_NEXT_TASKS.md) — historical task list; not used by runtime.
- [AGENTS.md](AGENTS.md) — AI-agent instructions; kept because it is explicitly referenced by workspace instructions and should not be removed blindly.
- [CLAUDE.md](CLAUDE.md) — wrapper instruction file; kept because it is referenced by repository guidance.
- [.env.example](.env.example) and [.env.production.example](.env.production.example) — kept because they are documented environment templates.
- [railway.json](railway.json), [nixpacks.toml](nixpacks.toml), [vercel.json](vercel.json) — kept because they are deployment-related and still relevant.

## Decisions
- Safe to delete: the one-off probe scripts, the legacy duplicate config, the experimental embed-reviews script, and the backup data file.
- Review required: the documentation files and deployment config files remain in place because they may still be useful for developers and deployment references.
- Keep: runtime app code, API routes, Stripe integration, DB access, Railway config, environment examples, and product data.

## Risk
Low. All removed items are either unreferenced one-off scripts or backup artifacts. Runtime app code and deployment files were preserved.
