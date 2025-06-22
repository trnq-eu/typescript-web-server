import express, { Request, Response, NextFunction} from "express";
import { config } from '../config.js';

// Middleware to log non-OK responses
export function middlewareLogResponse (
    req: Request, 
    res: Response, 
    next: NextFunction) {
    res.on("finish", () => {
        const statusCode = res.statusCode;
        if (statusCode < 200 || statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
        }
    });
    next();
};


export function middlewareMetricsInc(
    req: Request, 
    res: Response, 
    next: NextFunction): void {
    config.fileServerHits ++;
    next();
}