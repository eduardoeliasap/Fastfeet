/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';
import Recipent from '../models/Recipent';

class RecipentController {
  async index(req, res) {
    // Show all users storaged
    const recipents = await Recipent.findAll();

    return res.json(recipents);
  }

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
    } // If req.body data aren't in validate format.

    Recipent.create(req.body);

    // All fields has returned of req.body.
    return res.json(req.body);
  }
}

export default new RecipentController();
