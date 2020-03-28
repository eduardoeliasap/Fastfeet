import express from 'express';
import routes from './routes';
import './database'; // Call index.js of database folder

class App {
  constructor() {
    this.server = express();

    this.middlewares(); // Middlewares routines call
    this.routes(); // Routes call
  }

  middlewares() {
    this.server.use(express.json()); // Ability to process JSON format requests
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server; // I'm using this sintaxe due use Sucrase
