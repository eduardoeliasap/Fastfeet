/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';

class DeliverymanController {
  async index(req, res) {
    const deliverymans = await Deliveryman.findAll();

    if (!deliverymans) {
      return res.status(401).json({ err: 'None deliveryman found!' });
    }

    return res.json(deliverymans);
  }

  /**
   * Create Deliveryman
   * @param {*} req
   * @param {*} res
   */
  async store(req, res) {
    /**
     * Yup schema validation
     */
    /**
     * PENDENCIA
     * Não esta validando...
     */
    const schema = Yup.object().shape({
      name: Yup.string().min(3),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.dody))) {
      return res.status(401).json({ err: 'Validation fail!' });
    } // Show error message if Validation fail

    const { id, name } = await Deliveryman.create(req.body); // Insert Deliveryman data

    return res.json({ id, name });
  }

  /**
   * Update Deliveryman data
   * @param {*} req
   * @param {*} res
   */
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required().min(3),
      email: Yup.string().required().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ err: 'Validation fails!' });
    }

    const { name, email } = req.body; // Returned by JSON request
    const { id } = req.params; // Returned by URL Parameters

    /**
     * Update name and email's Deliveryman
     */
    const deliverymanExists = await Deliveryman.update(
      { name, email },
      { where: { id } },
    ); // Return affected rows number

    if (deliverymanExists[0] === 0) {
      return res.status(401).json({ err: 'Deliveryman id not found' });
    }

    return res.json(id, name, email);
  }

  /**
   * Delete Deliveryman
   * @param {*} req
   * @param {*} res
   */
  async delete(req, res) {
    const { id } = req.params; // Returned by URL Parameters

    const deliveryman = await Deliveryman.findByPk(id);

    if (!deliveryman) {
      return res.status(400).json({ err: 'Deliveryman not found!' });
    }

    const deliverymanDestroyed = await Deliveryman.destroy({
      where: { id },
    }); // Return affected rows number

    /**
     * Destroy confirmation
     */
    // eslint-disable-next-line max-len
    if (deliverymanDestroyed === 1) { return res.status(400).json({ rowsDestroyed: deliverymanDestroyed }); }

    return res.status(401).json({ err: 'Error on destroy deliveryman' });
  }
}

export default new DeliverymanController();
