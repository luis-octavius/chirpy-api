import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import {
  middlewareLogResponses,
  middlewareMetricsInc,
} from "./api/middleware.js";
import { errorHandler } from "./api/errors.js";
import { handlerMetrics, handlerResetMetrics } from "./api/metrics.js";
import { handlerValidateChirp } from "./api/validateChirp.js";

const app = express();
const PORT = 8080;

app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));

app.use(middlewareLogResponses);
app.use(express.json());

// api endpoints
app.get("/api/healthz", (req, res, next) => {
  Promise.resolve(handlerReadiness(req, res).catch(next));
});

app.post("/api/validate_chirp", (req, res, next) => {
  Promise.resolve(handlerValidateChirp(req, res)).catch(next);
});

// admin endpoints
app.get("/admin/metrics", (req, res, next) => {
  Promise.resolve(handlerMetrics(req, res).catch(next));
});
app.post("/admin/reset", (req, res, next) => {
  Promise.resolve(handlerResetMetrics(req, res).catch(next));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});
