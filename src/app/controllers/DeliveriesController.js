/* eslint-disable class-methods-use-this */

import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';
import Recipient from '../models/Recipient';

class DeliveriesController {
  /**
   * Lists Delivery Order details for a specific Deliveryman
   * @param {*} req
   * @param {*} res
   */
  async index(req, res) {
    // Verify if Deliveryman ID exists
    const deliverymanExists = await Deliveryman.findByPk(
      req.body.deliveryman_id,
    );
    if (!deliverymanExists) { return res.status(401).json({ err: 'Deliveryman not found!' }); }

    // Check if the Order exists, if it belongs to the deliveryman,
    // if it was not delivered or canceled
    const orderExists = await Order.findOne({
      where: { id: req.params.id, start_date: null, end_date: null },
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name'],
        },
      ],
    });
    if (!orderExists) { return res.status(401).json({ err: 'Order not found for this deliveryman or unavailable' }); }

    return res.json({ orderExists });
  }

  /**
   * Register delivery date
   * Records the recipient's signature
   * @param {*} req
   * @param {*} res
   */
  async store(req, res) {
    // eslint-disable-next-line camelcase
    const { order_id, deliveryman_id, signature_id } = req.body;

    /**
     * Order validate
     * Verify if order exists and belongs to the deliveryman
     */
    const orderDeliveryman = await Order.findOne({
      where: {
        id: order_id,
        deliveryman_id,
      },
    });
    if (!orderDeliveryman) {
      return res.status(401).json({ err: 'Order does not found to this deliveryman!' });
    }

    /**
     * PENDENCIA
     * Verificar se ja havia sido retirado para entrega
     */

    /**
     * Order validate
     * Verify that it has not been marked as delivered
     */
    const orderAvailable = await Order.findOne({
      where: {
        id: order_id,
        canceled_at: null,
        end_date: null,
      },
    });
    if (!orderAvailable) {
      return res.status(401).json({ err: 'Order already been delivered!' });
    }

    /**
     * Records the recipient's signature id in the delivery order
     */
    const orderDelivery = await Order.update(
      { end_date: new Date(), signature_id },
      { where: { id: order_id } },
    ); // Return affected rows number

    if (orderDelivery[0] === 0) {
      return res.status(400).json({ err: 'Delivery does not registered!' });
    }

    return res.json(orderDelivery);
  }
}

export default new DeliveriesController();
