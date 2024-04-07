import express, { Application, Request, Response } from 'express';
import { createFile, deleteFileById, getAllCategories, getAllFilesHandler, getFileById, getFilesByCategory } from './controllers/files';
import { assets, dashboard, index } from './controllers/dashboard';
import bodyParser from 'body-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
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

    router_front.get('/', index);
    router_front.get('/assets/:file', assets);
    router_front.get('/dashboard', dashboard);

    router_api.get('/files', getAllFilesHandler);
    router_api.post('/file/create', createFile);
    router_api.get('/file/:id', getFileById);
    router_api.delete('/file/:id', deleteFileById);

    router_api.get('/categories', getAllCategories);
    router_api.get('/category/:category', getFilesByCategory);

}

function RunServer() {
    app.listen(port, () => console.log(`Run at ${new Date().toLocaleString()}`));
}

MySQL.Connect().then(async () => {
    await SetupControllers(app);
    RunServer();
})