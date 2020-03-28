// Connection DataBase Config
import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

import User from '../app/models/User';
import Recipent from '../app/models/Recipent';

const models = [User, Recipent];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    // I'm calling the init method of each of the models, passing the connection as a parameter
    models.map((model) => model.init(this.connection));
  }
}

export default new Database();
