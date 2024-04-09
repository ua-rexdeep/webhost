import axios from "axios";
import { APIProvider } from "./api";

export function getAllCategories() {
    return APIProvider.get('/categories').then((response) => response.data);
}

export function createCategory(name: string) {
    APIProvider.post('/categories/create', { name });
}