# Lionel Adoukonou Portfolio

Personal portfolio for **Lionel Adoukonou**, Backend, DevOps and Cloud engineer. The project combines a public portfolio for the profile, projects, technical notes and contact with a private OAuth-protected administration console.

The public interface uses English by default and automatically detects French browser preferences. Visitors can switch between English and French from the language control in the header; the choice is persisted locally.

## Features

- Responsive public pages: home, projects, project details, blog, blog details and contact.
- Static profile card and editorial blue/graphite visual system with no WebGL or 3D runtime.
- Automatic language detection with English fallback and an English/French switcher.
- Private admin console for profile, skills, experience, education, projects, articles and messages.
- OAuth authentication through Manus.
- Owner access recognized through `OWNER_OPEN_ID` even when the persisted user role has not yet synchronized to `admin`.
- Server-side `adminProcedure` protection for every administrative query and mutation.
- S3-compatible image storage for portraits and project covers.
- Sanitized rich text for blog content.
- Resend notifications for contact messages.
- Loading, error and empty states throughout the public and admin experiences.

## Stack

| Layer | Technology |
| --- | --- |
| Client | React 19, TypeScript, Vite, Wouter, TanStack Query, Tailwind CSS 4, Lucide |
| Server | Express, tRPC 11, SuperJSON |
| Data | Drizzle ORM, MySQL/TiDB |
| Authentication | Manus OAuth |
| Storage | S3-compatible object storage |
| Email | Resend |
| Testing | Vitest |

## Getting started

Use Node.js 22 and pnpm. The runtime must provide a reachable database and the environment variables listed below. Never commit a `.env` file or a secret.

```bash
pnpm install
pnpm dev
```

The development server runs the client and application server together.

## Quality checks

Run the following before opening a pull request:

```bash
pnpm check
pnpm test
pnpm build
```

The focused authentication, authorization, content and security tests run without external email credentials. The Resend integration tests require `RESEND_API_KEY` when the full suite is executed.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | MySQL/TiDB connection string |
| `JWT_SECRET` | Session cookie signing secret |
| `VITE_APP_ID` | Manus OAuth application ID |
| `OAUTH_SERVER_URL` | OAuth service URL |
| `VITE_OAUTH_PORTAL_URL` | OAuth login portal URL exposed to the client |
| `OWNER_OPEN_ID` | Open ID of the portfolio owner; grants admin access |
| `RESEND_API_KEY` | Resend API key for contact notifications |
| `BUILT_IN_FORGE_API_URL` / `BUILT_IN_FORGE_API_KEY` | Manus built-in services |
| Storage variables | Provided by the configured WebDev environment |

Secrets must remain server-side. Do not expose database URLs, JWT secrets, Resend keys or OAuth credentials in client code.

## Administration

Open `/admin` and use the Manus OAuth sign-in flow. The server grants administrative access only to a user with the `admin` role or to the user whose `openId` matches `OWNER_OPEN_ID`. Administrative procedures remain protected server-side even if a user manually navigates to an admin route.

After authentication, the console provides dedicated areas for:

- Profile, skills, experience and education.
- Published and draft projects, including image uploads.
- Blog articles and rich text content.
- Contact messages and notification status.

See [ADMIN_GUIDE.md](ADMIN_GUIDE.md) for the operational workflow. Additional technical documentation is available in [docs/](docs/).

## Repository structure

```text
client/             React pages, components, contexts and global styles
server/             tRPC routers, authentication, database helpers and services
drizzle/            Drizzle schema and migrations
shared/             Shared constants and types
docs/               Architecture, deployment, operations and troubleshooting guides
ADMIN_GUIDE.md      Administration guide
todo.md             Project implementation history
```

## Git workflow

Use a feature branch for changes and open a pull request against `master`:

```bash
git switch -c feature/admin-i18n-readme
git add .
git commit -m "fix: restore admin access and add bilingual interface"
git push -u github feature/admin-i18n-readme
gh pr create --repo lionellite/portfolio --base master --head feature/admin-i18n-readme
```

Do not force-push or merge an unrelated repository into `master` without reviewing the PR diff and confirming the intended replacement. This repository is prepared to be reviewed as a complete portfolio application.

## License

The source is distributed under the MIT license. Personal content, photography, written material and brand elements remain under Lionel Adoukonou’s control.
