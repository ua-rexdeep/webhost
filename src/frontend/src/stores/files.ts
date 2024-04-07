import axios from "axios";
import { defineStore } from "pinia"
import { ref } from "vue";
import api, { APIProvider } from "../api/api";
import { useCategories } from "./categories";
// import type { TFile } from "/server/mysqlService";
type TFile = { id: string, type: string, name: string, addedAt: number, lastUsed: number }

export const useFileStore = defineStore('FileStore', () => {

    const allFilesCount = ref(0);
    const files = ref<TFile[]>([
        {
            addedAt: Date.now(),
            id: 'copt',
            lastUsed: Date.now(),
            name: 'copy',
            type: 'png',
        }
    ]);

    async function GetAllFilesData() {
        const data = await api.getAllFiles();
        files.value = data;

        allFilesCount.value = data.length;

        const categories = useCategories();
        categories.currentCategory = null;

        // const lazyLoad = () => {
        //     console.log(typeof(data))
        //     files.value.push(...(data.splice(0, data.length > 4 ? 4 : data.length)));
        //     if(data.length) setTimeout(lazyLoad, 500);
        // }
        // lazyLoad();
    }

    async function GetFilesByCategory(name: string) {
        const data = await api.getFilesByCategory(name);
        files.value = data;

        // const lazyLoad = () => {

        //     console.log(typeof(data))
        //     files.value.push(...(data.splice(0, data.length > 4 ? 4 : data.length)));
        //     if(data.length) setTimeout(lazyLoad, 500);
        // }
        // lazyLoad();
    }

    async function CreateFile(formData: FormData) {
        const message = await api.createFile(formData);
        files.value.push(message);
    }

    function DeleteFile(id: string) {
        api.deleteFileById(id);
        files.value.splice(files.value.findIndex(v => v.id == id), 1);
    }

    return {
        files,
        allFilesCount,

        GetAllFilesData,
        CreateFile,
        DeleteFile,
        GetFilesByCategory,
    }
})