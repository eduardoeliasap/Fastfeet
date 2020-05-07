/**
 * Mailtrap configuration
 * Used only on develop environment
 */
export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // If i'm using SSL
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: 'Equipe FastFeet <noreply@fastfeet.com',
  }, // Configuration used for all email sending
};

/**
 * ** Production environment servers **
 * Amazon SES
 * Mailgun
 * Sparkpost
 */
