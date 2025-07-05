import { createChirp, getAllChirps, selectChirpById } from "../db/queries/chirps.js";
import { respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";
import { v4 as uuidv4 } from 'uuid';
export async function handlerSingleChirp(req, res) {
    const params = {
        chirpID: req.params.chirpID,
    };
    const chirp = await selectChirpById(params.chirpID);
    if (!chirp) {
        respondWithJSON(res, 404, {});
    }
    else {
        respondWithJSON(res, 200, {
            id: chirp[0].id,
            createdAt: chirp[0].createdAt,
            updatedAt: chirp[0].updatedAt,
            body: chirp[0].body,
            userId: chirp[0].user_id,
        });
    }
}
export async function handlerAllChirps(req, res) {
    const allChirps = await getAllChirps();
    const transformedChirps = allChirps.map((chirp) => {
        return {
            id: chirp.id,
            createdAt: chirp.createdAt,
            updatedAt: chirp.updatedAt,
            body: chirp.body,
            userId: chirp.user_id,
        };
    });
    respondWithJSON(res, 200, transformedChirps);
}
export async function handlerChirp(req, res) {
    const params = {
        body: req.body.body,
        userId: req.body.userId,
    };
    const maxChirpLength = 140;
    if (params.body.length > maxChirpLength) {
        throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
    }
    const words = params.body.split(" ");
    const badWords = ["kerfuffle", "sharbert", "fornax"];
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const loweredWord = word.toLowerCase();
        if (badWords.includes(loweredWord)) {
            words[i] = "****";
        }
    }
    const cleaned = words.join(" ");
    let myuuid = uuidv4();
    const chirp = await createChirp({
        id: myuuid,
        body: cleaned,
        createdAt: new Date(),
        updatedAt: new Date(),
        user_id: params.userId
    });
    respondWithJSON(res, 201, {
        id: chirp.id,
        createdAt: chirp.createdAt,
        updatedAt: chirp.updatedAt,
        body: chirp.body,
        userId: chirp.user_id,
    });
}
