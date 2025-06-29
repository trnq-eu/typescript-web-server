import { config } from "../config.js";
export async function handlerReset(_, res) {
    config.fileServerHits = 0;
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send("Hits reset to 0");
}
