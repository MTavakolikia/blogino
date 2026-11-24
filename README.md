# Blogino

A Next.js 16 blog with Prisma 7 and a local PostgreSQL database.

## Local setup

```bash
npm install
cp .env.example .env   # then adjust the values if needed
npm run db             # start the bundled Postgres cluster (keep this running)
npm run dev            # http://localhost:3000
```

`npm run dev` starts the local database automatically if it is not already
listening, so a separate `npm run db` is usually unnecessary. The data lives in
`.pgdata/`; delete that directory to reset it. Apply migrations and seed data
with:

```bash
npm run migrate
npm run seed
```

If the database is not reachable, pages now show a friendly
"Articles are temporarily unavailable" notice instead of a raw
`PrismaClientKnownRequestError`, and the full error is still logged on the
server. In production, set `DATABASE_URL` to your hosted database.

## Scripts

| Command             | Description                                      |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | Start database (if needed) and the dev server    |
| `npm run build`     | Generate Prisma Client and build the app         |
| `npm start`         | Serve the production build                       |
| `npm run db`        | Start the local Postgres cluster                 |
| `npm run db:stop`   | Stop the local Postgres cluster                  |
| `npm run migrate`   | Apply Prisma migrations                          |
| `npm run seed`      | Seed the database                                |
| `npm run test:unit` | Run Vitest unit tests                            |
| `npm run test:e2e`  | Run Playwright tests against a production server |
| `npm test`          | Run unit and end-to-end tests                    |

Playwright uses the locally installed Google Chrome. `npm run test:e2e` builds
the app first, then starts `npm run start` on port 3100 automatically.
