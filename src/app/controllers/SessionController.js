/* eslint-disable class-methods-use-this */
import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import authConfig from '../../config/auth'; // Auth configuration class
import User from '../models/User';

class SessionController {
  async store(req, res) {
    /**
     * Yup Schema Validation
     */
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isType(req.body))) {
      res.status(400).json({ err: 'Validation fails!' });
    }

    /**
     * Verify is email exists
     */
    const userExists = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!userExists) { return res.status(401).json({ err: 'Email does not exists!' }); }

    /**
     * Passoword confirmation. Only to emails exists
     */
    const passwordConfirm = await userExists.checkPassword(req.body.password);
    if (!passwordConfirm) { return res.status(401).json({ err: 'Invalid password' }); }

    const { id, name, email } = userExists;

    return res.json({
      userExists: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }), // Return token
    });
  }
}

export default new SessionController();
