/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipentController {
  async index(req, res) {
    // Show all users storaged
    const recipents = await Recipient.findAll();

    return res.json(recipents);
  }

  /**
   * Create Recipients
   * @param {*} req
   * @param {*} res
   */
  async store(req, res) {
    // User Validation using Yup Schema Validation
    const schema = Yup.object().shape({
      name: Yup.string()
        .required()
        .min(3),
      addres: Yup.string().min(5),
      number: Yup.string().min(1),
      complement: Yup.string().min(3),
      city: Yup.string().min(5),
      state: Yup.string().min(2),
      zipcode: Yup.string().min(9),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ err: 'Validation fail!' });
    }

    Recipient.create(req.body);

    return res.json(req.body);
  }
}

export default new RecipentController();
