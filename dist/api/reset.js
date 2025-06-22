import { config } from "../config.js";
export async function handlerReset(_, res) {
    config.fileServerHits = 0;
}
