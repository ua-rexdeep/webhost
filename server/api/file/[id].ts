import fs from "fs";
import { MySQL } from "~/server/mysqlService";

const cache: Record<string, any> = {};
export default defineEventHandler(async ({ context, req, res, method }) => {
    const id = context.params?.id?.split('.')?.at(0);
    if(!id) throw new Error("No file id to get")

    console.log(method, id)
    
    if(method == "GET") {
        const file = await MySQL.GetFileById(id);

        // referer prevents update last used data, if requested from host
        if(file && !req.headers?.referer?.includes('localhost:3092')) MySQL.UpdateFileLastUsed(id);
        if(!file) throw new Error(`No file with id ${id}`)

        res.setHeader('Content-Disposition', `attachment; filename=${id}.${file.type}`);
        res.setHeader('Content-Transfer-Encoding', 'binary');
        res.setHeader('Content-Type', 'application/octet-stream');
        const data = await new Promise((done,rej) => {
            fs.readFile(`./storage/${id}.${file.type}`, {}, (err, r) => {
                done(r);
                console.log(id, "LOADED")
            });
        })
        cache[id] = data;
        return data;
    } else if(method == "DELETE") {
        if(!req.headers?.referer?.includes('localhost:3092')) throw new Error("Not allowed");
        const file = await MySQL.GetFileById(id);
        if(file) {
            MySQL.DeleteFileById(id);
            fs.rmSync(`./storage/${id}.${file.type}`);
            return true;
        } else {
            return false;
        }
    }

    throw new Error("Method not implmeneted");
})