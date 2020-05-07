/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';

import Mail from '../../lib/Mail';

class OrderController {
  /**
   * Return all avaliable Orders
   * @param {} req
   * @param {*} res
   */
  async index(req, res) {
    const orders = await Order.findAll({
      where: { start_date: null },
    });

    if (orders === null) {
      return res.status(401).json({ err: 'None avaliable orders found!' });
    }

    return res.json(orders);
  }

  /**
   * Create orders
   * Recipent and Deliveryman are recorded when a Order is created
   * @param {*} req
   * @param {*} res
   */
  async store(req, res) {
    /**
     * Verify if the Recipient exists
     */
    const recipientExist = await Recipient.findByPk(req.body.recipient_id);
    if (!recipientExist) {
      return res.status(401).json({ err: 'Recipient not found!' });
    }

    /**
     * Verify if the Deliveryman exists
     */
    const deliverymanExist = await Deliveryman.findByPk(req.body.deliveryman_id);
    if (!deliverymanExist) {
      return res.status(401).json({ err: 'Deliveryman not found!' });
    }

    const { name, email } = deliverymanExist;

    // Register Order
    const order = await Order.create(req.body);

    // After the Order created, an email is sent to the Deliveryman.
    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'Delivery order available',
      text: 'You have a new delivery order. The product is available for pickup.',
    });

    return res.json(order);
  }

  /**
   * Update product name Order
   * @param {*} req
   * @param {*} res
   */
  async update(req, res) {
    // Verify is Order id exists
    const orderExits = await Order.findByPk(req.body.order_id);
    if (!orderExits) { return res.status(401).json({ err: 'Order not exists!' }); }

    // Validation product name
    const schema = Yup.object().shape({
      product_name: Yup.string().min(3).max(255),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ err: 'Validation fail!' });
    }

    /**
     * Find Order Id and update name product
     */
    const orderUpdated = await Order.update(
      { product: req.body.product_name },
      { where: { id: req.body.order_id } },
    ); // Return affected rows number

    if (orderUpdated[0] === 0) {
      return res.status(400).json({ err: 'Order not update!' });
    }

    return res.json(orderUpdated);
  }

  /**
   * Delete Orders if start_date null
   * @param {*} req
   * @param {*} res
   */
  async delete(req, res) {
    const orderExits = await Order.findByPk(req.body.order_id);
    if (!orderExits) { return res.status(401).json({ err: 'Order not exists!' }); }

    // Consult if start_date is null
    /**
     * PENDÊNCIA
     * Não esta validando
     */
    const startdateNull = await Order.findOne(
      { start_date: null },
      { where: { id: req.body.order_id } },
    );
    if (!startdateNull) { return res.status(401).json({ err: 'Order already started!' }); }

    const orderDestroyed = await Order.destroy({
      where: { id: req.body.order_id },
    }); // Return affected rows number

    /**
     * Destroy confirmation
     */
    // eslint-disable-next-line max-len
    if (orderDestroyed === 1) { return res.json({ rowsDestroyed: orderDestroyed }); }

    return res.status(400).json({ err: 'Error on destroy Order' });
  }
}

export default new OrderController();
