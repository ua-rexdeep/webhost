import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import fs from 'fs';
import { MySQL } from '../mysqlService';

export function getAllFilesHandler(req: Request, res: Response) {
    

    MySQL.GetAllFiles().then((files) => res.json(files));
}

export function getAllCategories(req: Request, res: Response) {

    MySQL.GetAllCategories().then((response) => res.json(response));
}

export function getFilesByCategory(req: Request<{ category: string }>, res: Response) {
    

    MySQL.GetFilesByCategory(req.params.category).then((response) => res.json(response));
}

export async function createFile(req: Request, res: Response) {
    

    const id = req.body['file-id'];
    const category = req.body['file-category'];
    if(req.files) {
        const file = req.files![0] as UploadedFile;
        let type = file.mimetype.split('/')[1];
        
        if(type == 'mpeg') type = 'mp3';

        const fileData = await MySQL.GetFileById(id);
        if(fileData) {
            res.statusCode = 400;
            return void res.json({ error: 'File with id already exists' });
        }
        
        file.mv(`storage/${id}.${type}`, async (err) => {
            if(err) {
                console.error(err);
                res.end();
            }
            else {
                await MySQL.CreateFile(id, category, type, file.size);

                const newFile = await MySQL.GetFileById(id);
                res.json(newFile);
            }
        });
    }
}

export async function getFileById(req: Request<{ id: string }>, res: Response) {
    const id = req.params.id.split('.')[0];
    const fileData = await MySQL.GetFileById(id);
    if(fileData) {

        fs.readFile(`storage/${id}.${fileData.type}`, (err, fileBuffer) => {
            if(err) {
                res.statusCode = 404;
                return void res.json({ error: err.code });
            }

            if(req.ip != '::1') MySQL.UpdateFileLastUsed(id);
            res.end(fileBuffer);
        })

    } else {
        res.statusCode = 404;
        return void res.json({ error: 'No file in database' });
    }
}

export async function getFileDataById(req: Request<{ id: string }>, res: Response) {
    const id = req.params.id.split('.')[0];
    const fileData = await MySQL.GetFileById(id);
    console.log("GETFILE", id)
    res.json(fileData);
}

export async function deleteFileById(req: Request<{ id: string }>, res: Response) {
    const fileData = await MySQL.GetFileById(req.params.id);

    if(fileData) MySQL.DeleteFileById(req.params.id);
    else throw new Error("No file with id");

    fs.rm(`storage/${req.params.id}.${fileData.type}`, () => {});
    res.end();
}

export function createCategory(req: Request, res: Response) {
    console.log('create', req.body)
    const name = req.body.name;
    MySQL.CreateCategory(name);

    res.end();
}

export function changeFileCategory(req: Request<{ id: string }, null, { categoryName: string }>, res: Response) {
    
    MySQL.ChangeFileCategory(req.params.id, req.body.categoryName);

    res.end();
}