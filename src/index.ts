import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import {
  middlewareLogResponses,
  middlewareMetricsInc,
} from "./api/middleware.js";
import { errorHandler } from "./api/errors.js";
import { handlerMetrics } from "./api/metrics.js";
import {
  handlerAddChirp,
  handlerAllChirps,
  handlerGetChirpById,
  handlerDeleteChirpById,
} from "./api/chirps.js";
import {
  handlerCreateUser,
  handlerLogin,
  handlerRefreshToken,
  handlerRevokeRefreshToken,
  handlerReset,
  handlerUpdateUser,
} from "./api/users.js";
import { handlerUpdateMembership } from "./api/polka.js";

import { config } from "./config.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

// do the migration automatically at the app initialization
const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
const PORT = 8080;

app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));

app.use(middlewareLogResponses);
app.use(express.json());

// api endpoints
app.get("/api/healthz", (req, res, next) => {
  Promise.resolve(handlerReadiness(req, res)).catch(next);
});

app.post("/api/polka/webhooks", (req, res, next) => {
  Promise.resolve(handlerUpdateMembership(req, res)).catch(next);
});

// chirp endpoints
app.post("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerAddChirp(req, res)).catch(next);
});

app.get("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerAllChirps(req, res)).catch(next);
});

app.get("/api/chirps/:chirpId", (req, res, next) => {
  Promise.resolve(handlerGetChirpById(req, res)).catch(next);
});

app.delete("/api/chirps/:chirpId", (req, res, next) => {
  Promise.resolve(handlerDeleteChirpById(req, res)).catch(next);
});

// user endpoints
app.post("/api/users", (req, res, next) => {
  Promise.resolve(handlerCreateUser(req, res)).catch(next);
});

app.post("/api/login", (req, res, next) => {
  Promise.resolve(handlerLogin(req, res)).catch(next);
});

app.post("/api/refresh", (req, res, next) => {
  Promise.resolve(handlerRefreshToken(req, res)).catch(next);
});

app.post("/api/revoke", (req, res, next) => {
  Promise.resolve(handlerRevokeRefreshToken(req, res)).catch(next);
});

app.put("/api/users", (req, res, next) => {
  Promise.resolve(handlerUpdateUser(req, res)).catch(next);
});

// admin endpoints
app.get("/admin/metrics", (req, res, next) => {
  Promise.resolve(handlerMetrics(req, res)).catch(next);
});
app.post("/admin/reset", (req, res, next) => {
  Promise.resolve(handlerReset(req, res)).catch(next);
});

app.use(errorHandler);

app.listen(PORT, () => {
});
