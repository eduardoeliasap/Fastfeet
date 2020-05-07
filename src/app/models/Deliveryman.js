import Sequelize, { Model } from 'sequelize';

class Deliveryman extends Model {
  static init(sequelize) {
    super.init({
      name: Sequelize.STRING,
      avatar_id: Sequelize.INTEGER,
      email: Sequelize.STRING,
    }, {
      sequelize,
    });
  }
}

export default Deliveryman;
