import { Request, Response } from "express";
import path from "path";

export function index(req: Request, res: Response) {
    console.log(req.url)
    res.redirect('/dashboard');
}

export function dashboard(req: Request, res: Response) {
    console.log(req.url)
    res.sendFile(path.join(__dirname, '/index.html'));
}

export function assets(req: Request, res: Response) {
    console.log(req.url)
    res.sendFile(path.join(__dirname, req.url));
}