/**
 * Sending email Configuration
 */
import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const {
      host, port, secure, auth,
    } = mailConfig; // mail.js class destructuring.

    // "transport" is the way that nodemailer calls an external service to send emails.
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
      // I am doing this because I can have different email sending strategies
      // that not need authentication.
    });
  }

  /**
   * I am creating this method separately and not in my controller, because
   * with this I can get the default data from my config/mail.js and
   * add with the data that comes from controller.
   * @param {*} message
   */
  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default, // Sender data
      ...message,
    });
  }
}

export default new Mail();
