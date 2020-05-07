/* eslint-disable class-methods-use-this */
import {
  subHours,
  isAfter,
  isBefore,
  parseISO,
} from 'date-fns';
import Deliveryman from '../models/Deliveryman';
import Order from '../models/Order';

class WithdrawalController {
  /**
   * Register a Withdrawal (pickup) of the avaliable order
   * @param {*} req
   * @param {*} res
   */
  async store(req, res) {
    /**
     * Verify if Deliveryman exists
     */
    const deliveryman = await Deliveryman.findByPk(req.body.deliveryman_id);
    if (!deliveryman) {
      return res.status(401).json({ err: 'Deliveryman not found!' });
    }

    /**
     * Verify if Orders not started (still avaliable)
     */
    const ordersAvaliable = await Order.findOne({
      where: {
        id: req.body.id,
        deliveryman_id: req.body.deliveryman_id,
        start_date: null,
      },
    });
    if (!ordersAvaliable) {
      return res.status(401).json({ err: 'Order not avaliable!' });
    }

    /**
     * Verity hour
     * This date is received on Unix Time Stamp format.
     * For tests, you may use new Date().getTime() on Broswer Inspector
     */
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ err: 'Date not informed!' });
    }

    const searchDate = Number(date); // Verify if date has informed is Number format
    if (!searchDate) {
      return res.status(401).json({ err: 'Invalid format date!' });
    }

    const dateAtual = new Date().toISOString(); // Return current date and hour
    const [data] = dateAtual.split('T');

    const datewithSub = subHours(searchDate, 3);
    const dateBeforeEight = `${data}T08:00:00.000Z`; // Convert the current data to yyyy-mm-ddT08:00:00.000Z format
    const dateAfterEighteen = `${data}T18:00:00.000Z`; // Convert the current data to yyyy-mm-ddT18:00:00.000Z format

    /**
     * Limit of 5 withdrawals per day
     * Consult how many withdrawals were recorded on the day
     */
    const withdrawlLimit = await Order.findAll(
      { start_date: data },
      { deliveryman_id: req.body.deliveryman_id },
    );
    if (withdrawlLimit > 5) {
      return res.status(401).json({ err: 'Withdrawal limit exceeded!' });
    }

    // Checks if the withdrwal time is before 08:00 or after 18:00
    if (isBefore(datewithSub, parseISO(dateBeforeEight))
        || isAfter(datewithSub, parseISO(dateAfterEighteen))) {
      return res.status(401).json({ err: 'Withdrawl not permition in this hour!' });
    }

    /**
     * WithDrawals confirmation
     */
    const withdrawlConfirmation = await ordersAvaliable.update(
      { start_date: new Date() },
      { where: { id: req.body.id } },
    ); // Return affected rows number

    return res.json(withdrawlConfirmation);
  }
}

export default new WithdrawalController();
