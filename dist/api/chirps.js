import { respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";
const profaneWords = ["kerfuffle", "sharbert", "fornax"];
export async function handlerChirpsValidate(req, res) {
    const params = req.body;
    const maxChirpLength = 140;
    if (!params || !params.body || typeof params.body !== 'string') {
        throw new BadRequestError("Invalid request body: body property missing or incorrect type");
        return;
    }
    if (params.body.length > maxChirpLength) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
    let cleanedBody = params.body;
    const words = params.body.split(" ");
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const lowerCaseWord = word.toLowerCase();
        if (profaneWords.includes(lowerCaseWord)) {
            cleanedBody = cleanedBody.replace(word, "****");
        }
    }
    respondWithJSON(res, 200, { cleanedBody: cleanedBody });
}
