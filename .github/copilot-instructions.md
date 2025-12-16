<!-- Copilot instructions for the babyTracker repo -->
# babyTracker — Copilot Instructions

This file contains concise, repo-specific guidance for AI coding agents working on babyTracker.

- **Big picture:** This is a small TypeScript Node/Express API that stores feeding logs in MongoDB via Mongoose. The TypeScript sources live under `src/` and compiled output (when produced) is in `build/`.

- **Entry point:** `src/index.ts` — sets up Express, JSON middleware, mounts `src/routes/logRouter.ts`, and supplies a final error handler that expects an error object with `.log` and `.error`.

- **Routing & flow:** Routes are defined in `src/routes/logRouter.ts`. Each route chains middleware in this pattern: controller -> validation -> response handler. Controllers put results on `res.locals` (e.g. `res.locals.logs`, `res.locals.log`, `res.locals.deletedCount`) and validations assert those values before sending responses.

- **Controllers & models:** Controllers live in `src/controllers/` and use the default-exported Mongoose model from `src/models/logModels.ts` (import `Log`/`ILog`). The model file also establishes the Mongoose connection; do not duplicate connection logic elsewhere. `src/models/logModels.ts` selects the Mongo URI based on `NODE_ENV`:
  - `production` → MongoDB Atlas using `DB_USER`, `DB_PASS`, `DB_NAME` from env
  - `development` → Docker network host `db` (used by `docker-compose-dev.yml`)
  - `devlocal` → `localhost` (local mongod service)

- **Key schema fields:** `ILog` has `day` (string), `time` (string), `feedAmount` (number). Validation and response code assume these exact keys.

- **Validation pattern:** Validation middleware is in `src/validations/logValidation.ts`. Follow the existing pattern: run validation middleware after controllers when controllers populate `res.locals`, and use the existing validation method names like `validFeedAmount`, `gotLog`, `gotLogs`, `deletedLog`.

- **Conventions to preserve:**
  - Use `res.locals` for passing data between middleware.
  - Controllers are objects exporting functions (see `src/controllers/logController.ts`).
  - Route handlers respond with `res.status(200).json(...)` in the final handler, not inside controllers.
  - Error handler in `src/index.ts` logs `err.log` and sends `err.error` with status 500.

- **Build / dev / run workflows:**
  - Local dev (TS hot-reload): `npm run dev` (uses `nodemon`). Alternative: `npm run dev:server` (`ts-node-dev`).
  - Build JS: `npm run build` → compiles to `build/` via TypeScript.
  - Prod run (compiled): `npm run prod` runs `node ./build/index.js`.
  - The `start` script currently runs `ts-node src/index.ts` with `NODE_ENV=production` — be aware this runs TypeScript directly (not compiled JS).
  - Docker dev: see `docker-compose-dev.yml` and `Dockerfile-dev`. Dev docker setup expects the Mongo service reachable as hostname `db` (see `src/models/logModels.ts`).

- **When editing code:**
  - Change `src/` TypeScript files and run `npm run build` if producing compiled artifacts. The runtime source of truth is `src/` during development.
  - If you add new environment-dependent DB behavior, update `src/models/logModels.ts` (connection logic centralized there).

- **Examples to follow:**
  - Read request flow: `src/routes/logRouter.ts` → `src/controllers/logController.ts` → `src/validations/logValidation.ts` → final response in router.
  - DB connection & schema: `src/models/logModels.ts` — new features should reuse `Log` model export.

- **Common pitfalls:**
  - Do not assume `req.body` fields exist — validation middleware is used to assert inputs.
  - When running containers, ensure `NODE_ENV` matches the connection URI logic (`development` vs `devlocal` vs `production`).
  - Tests are configured (`jest`) but may be incomplete; search for tests before adding assumptions.

If anything here is unclear or you'd like the instructions to include more examples (sample PR checklist, preferred commit message style, or test patterns), tell me which area to expand. After your feedback I'll iterate.
