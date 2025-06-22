import express, { Request, Response, NextFunction} from "express";
import { config } from '../config.js';

/**
 * Handles requests to the /metrics path, returning the current
 * number of file server hits as plain text.
 * The format will be "Hits: x", where x is the count.
 *
 * @param req The Express Request object.
 * @param res The Express Response object.
 */

export function handlerMetrics(_: Request, res: Response): void {
    // set header to plain text
    res.setHeader('Content-Type', 'text/plain');

    // construct the response string
    const responseText = `Hits: ${config.fileServerHits}`;

    // send formatted text back to the client
    res.send(responseText)
    res.end()

}