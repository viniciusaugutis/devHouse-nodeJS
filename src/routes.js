import { Router } from 'express';
import SessionController from './controllers/SessionController';
import HouseController from './controllers/HouseController';
import DashboardController from './controllers/DashboardController';
import ReserveController from './controllers/ReserveController';

import multer from 'multer';
import uploadConfig from './config/uploader';

const routes = new Router();
const upload = multer(uploadConfig);

routes.post('/sessions', SessionController.store);

routes.get('/houses', HouseController.index);
routes.post('/houses', upload.single('thumbnail'), HouseController.store);
routes.put('/houses/:id', upload.single('thumbnail'), HouseController.update);
routes.delete('/houses', HouseController.destroy);

routes.get('/dashboard', DashboardController.show);

routes.post('/houses/:house_id/reserve', ReserveController.store);

export default routes;

