import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipentController from './app/controllers/RecipentController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router(); // Route create

// routes.get('/', (req, res) => {
//   const user = User.create({
//     name: 'Eduardo Elias Alves Pereira',
//     email: 'eduardo.eliasap@gmail.com',
//     password_hash: '1234',
//   });
//   res.json(user);
// });

// Users routes
routes.get('/users', UserController.index);
routes.post('/users', UserController.store);

routes.post('/auth', SessionController.store);

/**
 * I can use authentication for each route (routes.put('/users', authMiddleware,
 * UserController.update);) or I can use it with global middleware.
 */

/**
 * The authentication middleware defined at this point will only work
 * for routes after this declaration.
 * The routes defined above will not go through authentication.
 */
routes.use(authMiddleware);

// Recipents routes
routes.post('/recipent', RecipentController.store);
routes.get('/recipent', RecipentController.index);


export default routes;
