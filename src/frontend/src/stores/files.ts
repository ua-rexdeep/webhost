import { defineStore } from "pinia"
import { ref } from "vue";
import api from "../api/api";
import { useCategories } from "./categories";
import { useToast } from "vue-toast-notification";
// import type { TFile } from "/server/mysqlService";
type TFile = { id: string, type: string, addedAt: number, lastUsed: number }

export const useFileStore = defineStore('FileStore', () => {

    const allFilesCount = ref(0);
    const files = ref<TFile[]>([
        {
            addedAt: Date.now(),
            id: '123',
            lastUsed: Date.now(),
            type: 'jpg',
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
        useToast().success(`File ${id} deleted`, { position: 'top' })
    }
    
    function DoesFileAlreadyExists(name: string) {
        return api.getFileMetaById(name).then(({ data }) => {
            console.log(data, typeof(data), data != null || data.length == 0)
            return data != null && data.length != 0;
        })
    }

    return {
        files,
        allFilesCount,

        GetAllFilesData,
        CreateFile,
        DeleteFile,
        GetFilesByCategory,
        DoesFileAlreadyExists,
    }
})