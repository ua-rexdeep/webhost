import { NextFunction, Request, Response } from "express";

export function IPMiddleware(req: Request, res: Response, next: NextFunction) {
    if(req.ip == '::1' || req.ip?.includes('127.0.0.1') || ((process.env.ALLOW_IP||'').length > 5 && req.ip?.includes(process.env.ALLOW_IP!))) next();
    else {
        res.status(403).json({ error: 'help me' });        
    }
}