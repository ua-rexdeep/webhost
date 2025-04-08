import { Request, Response } from "express";
import path from "path";

export function index(req: Request, res: Response) {
    res.redirect('/dashboard');
}

export function dashboard(req: Request, res: Response) {
    res.sendFile(path.join(__dirname, '/index.html'));
}

export function assets(req: Request, res: Response) {
    res.sendFile(path.join(__dirname, req.url));
}

export function externalAccessPoint(req: Request, res: Response) {
    res.send(process.env.WEB_IP);
}