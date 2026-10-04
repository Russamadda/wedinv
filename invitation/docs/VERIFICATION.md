# Verification record

Completed against the local demo; production PostgreSQL was not configured.

- Production build and TypeScript validation passed.
- 13 domain tests passed: Lithuania deadline boundary, individual/couple/mixed attendance, required attendance, controlled companion names, foreign/duplicate guest IDs, dietary/contact validation, decline cleanup, different lodging plans, duplicate requests, stale versions, administrator deadline override, CSV injection protection.
- 24 HTTP integration checks passed against the production-mode local server. These include authenticated administration, unauthorized guest/admin/CSV denial, durable save/reopen/edit, failed-save preservation of stored state, idempotent retry, simultaneous partner updates (one 200, one 409), token rotation, invalid/revoked access, cross-origin denial and hotel CSV filtering. See `http-check-results.json`.
- Browser: fictional couple submission saved and showed a per-person summary. Unfinished attendance, dietary, venue overnight, hotel and message answers survived language switching. A deliberate invalid-contact submission showed the localized server error while retaining typed answers.
- Browser: authenticated administrator login, totals, household list, editing/rotation/revocation controls and CSV links were inspected.
- Browser layout: 72 public-page combinations (four pages × three languages × six widths), 18 RSVP saved-summary combinations and 18 active-form combinations had no horizontal overflow. Input text was at least 16px. Widths: 320, 375, 390, 430, 768, 1440. See corresponding JSON files.
- All downloaded raster images used by the rendered public pages loaded during the layout checks.
- Live Canva navigation, scrolling, all five destinations and the embedded RSVP form were inspected. Source images, colors, text and font metadata were extracted. Hero and envelope layers were visually compared; exact visual/animation parity is not certified.
- Reduced-motion behavior is implemented through both a media query and an early observer guard, and reviewed in source. It was not tested with an OS/browser reduced-motion override. Keyboard semantics and focus styles are implemented, but a complete keyboard-only end-to-end pass remains outstanding.
- No production database, real guest list, delivery service, public deployment or invitation sending was exercised.

The conservative fades and documented font substitutions require final visual review. See `REFERENCE-AUDIT.md` for missing links, source copy issues and animation differences. Full-page screenshots from the in-app browser showed stitching artifacts; viewport screenshots should be used for visual evidence.
