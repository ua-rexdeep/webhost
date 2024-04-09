import axios from "axios";
import { createFile, deleteFileById, getAllFiles, getFileMetaById, getFilesByCategory } from "./files";
import { createCategory, getAllCategories } from "./categories";

const env = (import.meta as any).env;

export const APIProvider = axios.create({
    baseURL: `http://${env.VITE_IP}:3092/api`,
})

export default {
    getAllFiles,
    createFile,
    deleteFileById,
    getFileMetaById,

    getAllCategories,
    getFilesByCategory,
    createCategory,
}