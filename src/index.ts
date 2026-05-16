import express from "express";
import { handlerReadiness } from "./handlers/readiness.js";
import { middlewareLogResponses } from "./middleware/log.js";

const app = express();
const PORT = 8080;

app.use("/app", express.static("./src/app"));

app.use(middlewareLogResponses);

app.get("/healthz", handlerReadiness);

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}...`);
});
