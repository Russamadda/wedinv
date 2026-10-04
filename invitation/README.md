# Marthe & Deivi — independent wedding invitation

A local-only reconstruction of the supplied Canva website with Next.js, TypeScript, private household RSVP links, a server-side RSVP service and protected administration. Nothing has been published and no messages are sent by this application.

## Open the existing local preview

http://127.0.0.1:3001

The current environment is an explicitly labelled **local demo** using a durable SQLite file on this computer. It is not connected to production PostgreSQL. All fixture guests are fictional. The generated local administrator password is in the ignored `.data-demo-admin.txt` file. Open `/admin` and use that password; it is not a production credential. `.env.local` contains locally generated secrets and is also ignored.

## Run a fresh checkout

Requires Node.js 24.3+ (24 LTS recommended) and npm.

```sh
npm ci
cp .env.example .env.local
npm run admin:password
```

Copy the printed password hash and session secret into `.env.local`. The password command asks for a new administrator password; the plaintext is never placed in application source. Set `APP_ORIGIN` to the exact local URL, normally `http://127.0.0.1:3001`, then:

```sh
npm run demo:seed
npm run dev -- --port 3001
```

The fixture command prints new private links for a fictional individual, couple and permitted companion. These are opaque, cryptographically random links. Re-running adds new fixtures; it does not overwrite existing invitations.

For a production-mode **local** preview:

```sh
npm run build
npm start -- --port 3001
```

Stop the development server before building or starting on the same port. Local demo data survives server restarts in `.data/demo.sqlite`. Back up this directory before resetting anything. Never use the demo for the real guest list.

## Configure PostgreSQL before launch

1. Provision a private PostgreSQL database using your chosen provider. Use a dedicated application login, not a superuser or a browser-visible key. Configure verified TLS according to your provider.
2. Set `LOCAL_DEMO=false`, `DATABASE_URL`, a fresh `SESSION_SECRET` (at least 32 characters), `ADMIN_PASSWORD_HASH`, and the intended HTTPS `APP_ORIGIN` in the server environment.
3. Run `npm run db:migrate` against that database using a role allowed to create the two tables. Then use a restricted application role with `USAGE` on the schema and `SELECT, INSERT, UPDATE` on `invitations` and `request_limits`. No browser database access is used.
4. Run the functional checks against a staging database with fictional data. PostgreSQL integration is implemented but was **not executed here**, because no production database connection was supplied.
5. Keep `TRUST_PROXY=false` unless your trusted reverse proxy replaces untrusted incoming `X-Forwarded-For`. When enabled, rate limits use the proxy-provided client address. With it disabled, a conservative shared limit applies. Configure proxy request limits and redact request bodies/cookies. Invitation secrets use URL fragments and a POST exchange; they are never query parameters or route segments.
6. Review translations, unresolved links and reference differences in `docs/REFERENCE-AUDIT.md`. Obtain the couple's approval before any public hosting or distribution.

The database stores one JSONB invitation document per stable UUID. Each guest has a stable UUID inside that document. A row lock encloses authorization, validation, version checking and save in a single transaction. A unique SHA-256 token hash identifies the invitation. Regeneration replaces that hash, invalidating both older links and older invitation cookies. SQLite uses the same document and validation model under `BEGIN IMMEDIATE` for the demo.

## Administrator workflow

- Sign in at `/admin` with the server-configured administrator password. This is real password verification using scrypt, a signed HttpOnly/SameSite session and server authorization on every data route. Sessions last eight hours; changing the password hash invalidates existing sessions.
- Create a household label, preferred language, contact method and the exact invited people. Add an unnamed companion slot only if explicitly permitted. A known partner should be entered as a named guest.
- Copy the generated private link for manual SMS distribution. Raw tokens are intentionally not stored. Keep the copied link in your own secure distribution list; regenerating a link later invalidates the previous link.
- Edit invitation details without changing stable guest IDs. Review per-person answers, filter statuses and Kaunas interest, edit guest responses after the deadline, or export CSVs.
- The totals count people, including permitted companion slots, rather than household forms. A reserved unnamed slot counts as one invited/unanswered person until declined or answered.
- Revoke blocks an invitation immediately. Regenerate both revokes the old token and provides a new active one.
- No automatic email, SMS or hotel update is sent.

## Editing content and design

- `lib/content.ts`: English source copy and Norwegian/Lithuanian translations for the public pages. Preserve paragraph boundaries. Translations need review before launch.
- `lib/form-copy.ts`: all guest form labels, validation, saved summaries and messages in the three languages. The private administration interface is English.
- `lib/config.ts`: the single source for wedding date, RSVP deadline, timezone, contact details and external links. The close instant derives from the start of the day after the deadline in Europe/Vilnius. Current closure is **2027-02-25T22:00:00Z**, the start of 26 February in Lithuania. The wedding countdown derives from local midnight on 4 September, **2027-09-03T21:00:00Z**; this is a configurable countdown default, not the ceremony time.
- `components/Site.tsx`: responsive page sections and photograph/frame layers.
- `app/globals.css`: typography, colors, spacing, crops and small-screen styles.
- `public/assets/`: local artwork and photographs. Match named files to `docs/asset-map.json`; keep photo/frame layers separate.
- `public/fonts/`: open-source fonts and license notices.
- `migrations/001_initial.sql`: PostgreSQL schema.
- `reference/`: untouched downloaded exports, plus decoded inspection data. Do not include this directory in a public deployment.

Map, venue and registry buttons remain disabled with a clear unavailable message until their URLs are configured. Never replace empty configuration with `#` or unrelated destinations.

## Tests and evidence

```sh
npm test
npx tsc --noEmit
npm run build
```

`tests/http-check.mjs` is an additional local integration check. With the local demo server running at port 3001 and the generated demo administrator password file present, run `node tests/http-check.mjs`. It creates a clearly labelled fictional test invitation and leaves it revoked. Do not run it against real guest data.

See `docs/VERIFICATION.md`, the JSON check results and `docs/screenshots/`. Screenshot captures are for visual review, not page implementations. Some browser full-page captures had stitching artifacts; only the named viewport screenshots are reliable comparison evidence.

## Data and operational notes

The private link grants access to the whole named household, including dietary answers. The guest privacy copy explains this. Do not share real links publicly. No analytics, remote font services, Canva runtime, full guest-list bundle or third-party RSVP form is used. Social metadata is generic. Noindex and referrer protection are enabled; authorization is enforced separately by server routes. An application administrator has access to all responses. Delete or archive guest data according to your chosen retention policy after the event.

Production hosting, database provisioning, backups, real invitation creation, licensing confirmation for supplied artwork, final translations and launch approval remain external setup tasks. This project is not published.
