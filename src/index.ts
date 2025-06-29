import express from "express";

import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import {
  middlewareLogResponse,
  middlewareMetricsInc,
} from "./api/middleware.js";
import { handlerValidateChirp } from "./api/validate_chirp.js"; // Import the new handler

const app = express();
const PORT = 8080;

app.use(express.json()); // Add middleware to parse JSON request bodies - ADDED BACK
app.use(middlewareLogResponse);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

// TO-DO: create api routes

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);
app.post("/api/validate_chirp", handlerValidateChirp); // Add the new route BACK to original

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});