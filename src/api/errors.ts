import type { Request, Response, NextFunction } from "express";


class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
    }
}

class UnauthorizedError extends Error {
    constructor(message: string) {
        super(message);
    }
}

class ForbiddenError extends Error {
    constructor(message: string) {
        super(message);
    }
}

class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export async function handlerError(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    if (err instanceof NotFoundError) {
        res.status(404).send(err);
    } else if (err instanceof ForbiddenError) {
        res.status(403).send(err);
    } else if (err instanceof UnauthorizedError) {
        res.status(401).send(err);
    } else {
        res.status(500).send("Internal Server Error");
    }
    }
