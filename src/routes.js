import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipentController from './app/controllers/RecipentController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrderController from './app/controllers/OrderController';
import WithdrawalController from './app/controllers/WithdrawalController';
import DeliveriesController from './app/controllers/DeliveriesController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router(); // Route create
const upload = multer(multerConfig); // Multer config. File upload

// Users routes
routes.get('/users', UserController.index);
routes.post('/users', UserController.store);

// Auth routes
routes.post('/auth', SessionController.store);

/**
 * I may use authentication for each route (routes.put('/users', authMiddleware,
 * UserController.update);) or I may use it with global middleware.
 */

/**
 * The authentication middleware defined at this point will only work
 * for routes auth after this declaration.
 * The routes defined above will not go through authentication.
 */
routes.use(authMiddleware);

// Recipents routes
routes.get('/recipent', RecipentController.index);
routes.post('/recipent', RecipentController.store);

// Deliverymans routes
routes.get('/deliveryman', DeliverymanController.index);
routes.post('/deliveryman', DeliverymanController.store);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);

// Orders routes
routes.get('/order', OrderController.index);
routes.post('/order', OrderController.store);
routes.put('/order', OrderController.update);
routes.delete('/order', OrderController.delete);

// Withdrawls (Retiradas) routes
routes.post('/withdrawal', WithdrawalController.store); // Register withdrwal

// Deliveries (Entregas) routes
routes.get('/deliveries/:id', DeliveriesController.index); // Lista os dados da Ordem se ja não foi entregue
routes.post('/deliveries', DeliveriesController.store); // Register deliveryman to a especific Order

// Upload files routes
// I'm working with uploading single files.
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
