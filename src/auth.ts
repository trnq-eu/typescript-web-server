import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";
import type { Request, Response } from "express";
import crypto from "crypto";


export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword: string = await bcrypt.hash(password, saltRounds)


    return hashedPassword

}

export async function checkPasswordHash(textPassword: string, hashedPassword: string): Promise<boolean>{
    const check = await bcrypt.compare(textPassword, hashedPassword)
    return check
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;
    let now = Math.floor(Date.now() / 1000)
    const payload = {
        iss: "chirpy",
        sub: userID,
        iat: now,
        exp: now + expiresIn
    }
    return jwt.sign(payload, secret);

}

export function validateJWT(tokenString: string, secret: string): string {
    const decoded_payload = jwt.verify(tokenString, secret);
    
    if (typeof decoded_payload === 'object' && decoded_payload !== null && 'sub' in decoded_payload && typeof decoded_payload.sub === 'string') {
        return decoded_payload.sub;
    }

    throw new Error("Invalid token payload");
}


export function getBearerToken(req: Request): string {
    const auth_header = req.get('Authorization')
    if (!auth_header) {
        throw new Error('Invalid authorization')
    }
    else if (!auth_header.startsWith("Bearer ")) {
        throw new Error('Invalid authorization')
    }
    const token = auth_header.split(" ")[1]
    if (!token || token === 'undefined' || token === "" || token === " ") {
        throw new Error('Invalid authorization')
    }
    return token
};

export function makeRefreshToken(): string {
    return crypto.randomBytes(32).toString('hex')
}
