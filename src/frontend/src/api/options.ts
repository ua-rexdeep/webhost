import { APIProvider } from './api';

export function getExternalAccessPoint() {
    return APIProvider.get('/externalAccessPoint').then(({ data }) => data);
}