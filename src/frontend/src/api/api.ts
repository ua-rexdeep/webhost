import axios from "axios";
import { changeFileCategory, createCategory, getAllCategories } from "./categories";
import { createFile, deleteFileById, getAllFiles, getFileMetaById, getFilesByCategory } from "./files";
import { getExternalAccessPoint } from "./options";

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

    getExternalAccessPoint,
}