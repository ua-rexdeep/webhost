import { APIProvider } from './api'

export function getAllFiles() {
    return APIProvider.get('/files').then(({ data }) => data);
}

export function createFile(formData: FormData) {
    return APIProvider.post('/file/create', formData).then(({ data }) => data);
}

export function deleteFileById(id: string) {
    return APIProvider.delete(`/file/${id}`);
}

export function getFilesByCategory(id: string) {
    return APIProvider.get(`/category/${id}`).then((response) => response.data);
}