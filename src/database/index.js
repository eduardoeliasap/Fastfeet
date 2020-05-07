// Connection DataBase Config
import Sequelize from 'sequelize';
import databaseConfig from '../config/database';

import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import Deliveryman from '../app/models/Deliveryman';
import Order from '../app/models/Order';
import File from '../app/models/File';

const models = [User, Recipient, Deliveryman, Order, File];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    // I'm calling the init method of each of the models, passing the connection as a parameter
    models.map((model) => model.init(this.connection));
    // I'm going through all the models and calling the associations
    models.map((model) => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
