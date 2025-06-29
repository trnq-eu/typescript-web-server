import type { Request, Response } from "express";

type ChirpValidationRequest = {
  body: string;
};


export async function handlerValidateChirp(req: Request, res: Response) {
    let body = "";

    // Listen for data events
    req.on("data", (chunk) => {
        body += chunk;
    })

    // Listen for end events
    req.on("end", () => {
        try {
            const parsedBody = JSON.parse(body);

            if (!parsedBody || typeof parsedBody !== 'object' || !("body" in parsedBody) || typeof parsedBody.body !== 'string') {
                return res.status(400).json({ error: "Invalid JSON: body property missing or incorrect type"});
            }

            const chirpBody = parsedBody.body;

            if (chirpBody.length > 140) {
                return res.status(400).json({ error: "Chirp is too long"});
            }

            res.setHeader("Content-Type", "application/json");
            res.status(200).send(JSON.stringify({ valid: true}));
            res.end();

        } catch(error) {
            console.error("Error validating chirp: ", error);
            return res.status(400).send(JSON.stringify({ error: "Invalid JSON"}))
        }
    })


};

