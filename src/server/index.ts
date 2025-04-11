import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { Application } from 'express';
import fileUpload from 'express-fileupload';
import { assets, dashboard, externalAccessPoint, index } from './controllers/dashboard';
import { changeFileCategory, createCategory, createFile, deleteCategory, deleteFileById, getAllCategories, getAllFilesHandler, getFileById, getFileDataById, getFilesByCategory } from './controllers/files';
import { SendError } from './errorHandler';
import { IPMiddleware } from './middleware/ipmiddleware';
import { MySQL } from './mysqlService';

const app = express();
const port = process.env.PORT || 3092;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }))
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

async function SetupControllers(app: Application) {
    const router_front = express.Router();
    const router_api = express.Router();

    app.use('/', router_front);
    app.use('/api', router_api);

    router_front.get('/', IPMiddleware, index);
    router_front.get('/assets/:file', IPMiddleware, assets);
    router_front.get('/dashboard', IPMiddleware, dashboard);
    
    router_api.get('/externalAccessPoint', IPMiddleware, externalAccessPoint);

    router_api.get('/files', IPMiddleware, getAllFilesHandler);
    router_api.post('/file/create', IPMiddleware, createFile);
    router_api.get('/file/:id', getFileById);
    router_api.get('/file/:id/meta', IPMiddleware, getFileDataById);
    router_api.delete('/file/:id', IPMiddleware, deleteFileById);
    router_api.patch('/file/:id/category', IPMiddleware, changeFileCategory);

    router_api.get('/categories', IPMiddleware, getAllCategories);
    router_api.get('/category/:category', IPMiddleware, getFilesByCategory);
    router_api.post('/categories/create', IPMiddleware, createCategory)
    router_api.delete('/category/:category', IPMiddleware, deleteCategory)

}

function RunServer() {
    app.listen(port, () => {
        console.log(`Run at ${new Date().toLocaleString()}`)
        console.log(`Access: http://localhost:${port}/`);
        console.log(`External access: http://${process.env.WEB_IP}:${port}/`);
    });
}

MySQL.Connect().then(async () => {
    await SetupControllers(app);
    RunServer();
})

process.addListener('uncaughtException', async (err) => {
    SendError(err);
});