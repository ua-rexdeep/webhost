import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../api/api";
import { useFileStore } from "./files";

export const useCategories = defineStore('categoriesStore', () => {

    const categories = ref<{ name: string, num_files: number }[]>([
        {
            name: '1231',
            num_files: 0,
        }
    ]);
    const currentCategory = ref<string | null>(null);

    async function getAllCategories() {
        const cats = await api.getAllCategories();
        categories.value = cats;
        return cats;
    }

    function selectCategory(name: string) {
        const files = useFileStore();
        currentCategory.value = name;
        files.GetFilesByCategory(name);
    }

    function createCategory(name: string) {
        api.createCategory(name);
        categories.value.push({ name, num_files: 0 });
    }

    function changeFileCategory(id: string, category: string) {
        return api.changeFileCategory(id, category);
    }

    return {
        currentCategory,
        categories,

        selectCategory,
        getAllCategories,
        createCategory,
        changeFileCategory,
    }
});