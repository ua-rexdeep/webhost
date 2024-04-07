import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../api/api";
import { useFileStore } from "./files";

export const useCategories = defineStore('categoriesStore', () => {

    const categories = ref([]);
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

    return {
        currentCategory,
        categories,

        selectCategory,
        getAllCategories,
    }
});