export default defineNuxtRouteMiddleware(to => {
    if (process.server) return
    const store = useFileStore();
    $fetch('/api/groups').then((groups: string[]) => {
        if(groups.includes('user')) navigateTo('/403');
        store.SetRoles(groups);
    })
})