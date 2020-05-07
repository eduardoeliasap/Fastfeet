require('dotenv').config(); // Estou usando o require porque não posso usar o import aqui dentro

// Credentials database
module.exports = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamps: true,
    underscored: true,
    undescoredAll: true,
  },
};
