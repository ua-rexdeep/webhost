import { readFiles } from "h3-formidable";
import { errors as formidableErrors } from "formidable";
import path from "path";
import fs from "fs";
import { MySQL } from "~/server/mysqlService";

export default defineEventHandler(async (event) => {
    const maxFiles = 1;
    const fileSize = 1024 * 1024 * 50; // 50MB
    if(!event.req.headers?.referer?.includes('localhost:3092')) return;
    if(event.method == "POST") {
        const { files, fields } = await readFiles(event, {
            maxFiles: maxFiles,
            maxFileSize: fileSize,
        });
        
        if (!Object.keys(files).length) {
            throw createError({
                statusMessage: "2001",
                statusCode: 400,
            }); 
        }
        
        if(!fields['file-id']) throw new Error('No file ID');
        if(!fields['file-name']) throw new Error('No file name');
        let fileID = fields['file-id'][0];
        let fileName = fields['file-name'][0];
        for(const f of Object.values(files)) {
            const file = f![0];
            const filepath = file.filepath;
            const mimetype = file.mimetype;
            
            try {
                await new Promise(done => {
                    fs.copyFile(filepath, `./storage/${fields['file-id']}.${mimetype?.split('/')[1]}`, done);
                })

                MySQL.CreateFile(fileID, fileName, mimetype?.split('/')[1]!, file.size)
            } catch(e) {throw e;}
        } 
    
        return MySQL.GetFileById(fileID);
    } else {
        return MySQL.GetAllFiles();
    }
    
});