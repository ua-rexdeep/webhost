import { defineStore } from "pinia"
import type { TFile } from "~/server/mysqlService";

export const useFileStore = defineStore('FileStore', () => {

    const files = ref<TFile[]>([]);

    async function GetAllFilesData() {
        const data = await $fetch<TFile[]>('/api/file');
        files.value = [];

        const lazyLoad = () => {
            files.value.push(...data.splice(0, data.length > 4 ? 4 : data.length));
            if(data.length) setTimeout(lazyLoad, 500);
        }
        lazyLoad();
    }

    function GetFileById(id: string) {
        return $fetch(`/api/file/${id}`);
    }

    async function CreateFile(formData: FormData) {
        const message = await $fetch<TFile>('/api/file', {
            method: 'POST',
            body: formData,
        });
        files.value.push(message);
    }

    function DeleteFile(id: string) {
        $fetch(`/api/file/${id}`, { method: 'DELETE' });
        files.value.splice(files.value.findIndex(v => v.id == id), 1);
    }

    const roles = ref<string[]>([]);
    function SetRoles(groups: string[]) {
        roles.value = groups;
    }

    return {
        files,
        roles,

        GetAllFilesData,
        GetFileById,
        CreateFile,
        DeleteFile,
        SetRoles,
    }
})