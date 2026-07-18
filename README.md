# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## RSVP backend

The RSVP system uses the Netlify-hosted Vite frontend plus a Cloudflare Worker API backed by Cloudflare D1.

### Frontend

Set `VITE_RSVP_API_BASE_URL` in Netlify to the deployed Worker URL, for example:

```bash
VITE_RSVP_API_BASE_URL=https://rummanandesther-rsvp.YOUR_SUBDOMAIN.workers.dev
```

For local frontend development, the app defaults to `http://localhost:8787`.

### Cloudflare setup

1. Create the D1 database:

```bash
npx wrangler d1 create rummanandesther-rsvp
```

2. Put the returned `database_id` into `worker/wrangler.toml`.

3. Generate secrets:

```bash
node -e "crypto.subtle.digest('SHA-256', new TextEncoder().encode('YOUR_ADMIN_PASSWORD')).then(b => console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('')))"
node -e "console.log(crypto.randomUUID() + crypto.randomUUID())"
```

4. Store them in Cloudflare:

```bash
npx wrangler secret put ADMIN_PASSWORD_HASH --config worker/wrangler.toml
npx wrangler secret put SESSION_SECRET --config worker/wrangler.toml
```

5. Apply the D1 migration and deploy:

```bash
npm run worker:migrate:remote
npm run worker:deploy
```

### Local backend development

Create `worker/.dev.vars`:

```bash
ADMIN_PASSWORD=local-password
SESSION_SECRET=local-session-secret-change-me
```

Then run:

```bash
npm run worker:migrate:local
npm run worker:dev
```

Admin dashboard: `/admin`.

Named admin users can be configured with the `ADMIN_USERS` secret. It should be a JSON array:

```json
[
  {
    "username": "suja",
    "role": "readonly",
    "passwordHash": "SHA_256_PASSWORD_HASH"
  }
]
```

Read-only users can view households, invited family member names, and aggregate RSVP counts. By default, they cannot see access codes or invite URLs; copy invite and copy link controls are hidden. The `suja` and built-in `roshan` read-only accounts can copy invite messages and invite links, but still cannot create, edit, delete, import, export, or view admin notes, RSVP messages, dietary requirements, submitted timestamps, additional guest names, or individual attendance responses.

Named users must use `passwordHash`; plaintext `password` entries are ignored. The username `admin` is reserved for the owner admin password flow.

The built-in `roshan` account inherits Suja's password hash and always receives the same read-only permissions. Updating Suja's password therefore updates both accounts without storing a second password hash.

Guest RSVP links: `/rsvp/:accessCode`.

CSV import columns: `household, guest, plus_one_limit, most_likely_not_coming, partner, children_allowed, max_children, notes`.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
