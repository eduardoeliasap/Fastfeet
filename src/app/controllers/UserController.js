/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  /**
   * Routine for consul Users by email
   * @param {*} req
   * @param {*} res
   */
  async index(req, res) {
    const emailExists = await User.findOne({
      where: { email: req.body.email },
    });

    if (!emailExists) { return res.json({ err: 'Email does not exists!' }); }

    return res.json(emailExists);
  }

  async store(req, res) {
    // User Validation using Yup Schema Validation
    const schema = Yup.object().shape({
      name: Yup.string().required().min(3),
      email: Yup.string().required().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ err: 'Validation fails' });
    }

    const emailExists = await User.findOne({
      where: { email: req.body.email },
    });

    if (emailExists) { return res.json({ err: 'Email already exists!' }); }

    const { name, email, password } = User.create(req.body);

    return res.json({
      name, email, password,
    });
  }
}

export default new UserController();
