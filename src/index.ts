import express from "express";

import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import {
  middlewareLogResponse,
  middlewareMetricsInc,
} from "./api/middleware.js";
import { handlerChirpsValidate } from "./api/chirps.js";
import { handlerError } from "./api/errors.js"


const app = express();
const PORT = 8080;

app.use(middlewareLogResponse);
app.use(express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);

app.post("/api/validate_chirp", async(req, res, next) => {
try {
  await handlerChirpsValidate(req, res);
} catch(err) {
  next(err);}
});
app.use(handlerError);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
