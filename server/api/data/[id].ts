import { MySQL } from "~/server/mysqlService";

export default defineEventHandler(async ({ context }) => {
    const id = context.params?.id?.split('.')?.at(0);
    if(!id) throw new Error("No file id to get")
    
    const file = await MySQL.GetFileById(id);
    
    if(file) MySQL.UpdateFileLastUsed(id);

    return file;
})