import { APIProvider } from "./api";

export function getAllCategories() {
    return APIProvider.get('/categories').then((response) => response.data);
}

export function createCategory(name: string) {
    return APIProvider.post('/categories/create', { name });
}

export function changeFileCategory(id: string, name: string) {
    return APIProvider.patch(`/file/${id}/category`, { categoryName: name });
}

export function deleteCategory(name: string) {
    return APIProvider.delete(`/category/${name}`);
}