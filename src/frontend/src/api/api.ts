import axios from "axios";
import { createFile, deleteFileById, getAllFiles, getFileMetaById, getFilesByCategory } from "./files";
import { changeFileCategory, createCategory, getAllCategories } from "./categories";

export const APIProvider = axios.create({
    baseURL: `http://localhost:3092/api`,
})

export default {
    getAllFiles,
    createFile,
    deleteFileById,
    getFileMetaById,

    getAllCategories,
    getFilesByCategory,
    createCategory,
    changeFileCategory,
}