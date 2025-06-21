import express, { Request, Response, NextFunction} from "express";
import { config } from './config.js';

/**
 * Middleware function that increments the fileserverHits counter
 * every time a request passes through it.
 *
 * @param req The Express Request object.
 * @param res The Express Response object.
 * @param next The Express NextFunction to pass control to the next middleware.
 */
export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction): void {
    config.fileserverHits ++;
}