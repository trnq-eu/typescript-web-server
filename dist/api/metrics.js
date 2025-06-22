import { config } from "../config.js";
export async function handlerMetrics(_, res) {
    res.send(`Hits: ${config.fileServerHits}`);
    res.end();
}
