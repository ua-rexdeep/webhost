import { Axios } from "axios";
import { createFile, deleteFileById, getAllFiles, getFilesByCategory } from "./files";
import { getAllCategories } from "./categories";

export const APIProvider = new Axios({
    baseURL: 'http://localhost:3092/api',
})

APIProvider.interceptors.response.use((value) => {
    if(value.headers["content-type"]?.toString().includes('application/json') && typeof(value.data) != 'object') {
        value.data = JSON.parse(value.data);
    }
    return value;
}, (err) => err)

export default {
    getAllFiles,
    createFile,
    deleteFileById,

    getAllCategories,
    getFilesByCategory,
}