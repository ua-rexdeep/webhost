import { NextFunction, Request, Response } from "express";

export function IPMiddleware(req: Request, res: Response, next: NextFunction) {
    if(req.ip == '::1' || req.ip == '127.0.0.1') next();
    else {
        res.status(403).json({ error: 'help me' });        
    }
}