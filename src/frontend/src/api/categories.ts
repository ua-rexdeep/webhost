import { APIProvider } from "./api";

export function getAllCategories() {
    return APIProvider.get('/categories').then((response) => response.data);
}