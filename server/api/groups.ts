export default defineEventHandler(async (event) => {
    if(event.req.headers?.referer?.includes('localhost:3092')) return ['peof2', 'admin', 'unity'];
    else return ['user'];
});