import express from "express";

import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import {
  middlewareLogResponse,
  middlewareMetricsInc,
} from "./api/middleware.js";

const app = express();
const PORT = 8080;


// Apply the middleware at the application level
app.use(middlewareLogResponse);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

// Register the handler for the /healthz path
app.get("/healthz", handlerReadiness);

//Register handlerMetrics
app.get("/metrics", handlerMetrics);

//Register reset
app.get("/reset", handlerReset);


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

