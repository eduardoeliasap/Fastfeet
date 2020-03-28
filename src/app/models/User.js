import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // Just for using here
      },
      {
        sequelize,
      },
    );

    // eslint-disable-next-line arrow-parens
    this.addHook('beforeSave', async user => {
      if (user.password) {
        // eslint-disable-next-line no-param-reassign
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  } // Contains all values types allow set

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  } // Bcrypt compare method. Function that compare password has informed and password_hash database
}

export default User;
