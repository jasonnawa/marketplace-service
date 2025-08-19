require('dotenv').config();

module.exports = {
  username: process.env.POSTGRES_USER || 'nestuser',
  password: process.env.POSTGRES_PASSWORD || 'nestpass',
  database: process.env.POSTGRES_DB || 'nestdb',
  host:  process.env.POSTGRES_HOST || 'postgres',
  port: +(process.env.POSTGRES_PORT || 5432),
  dialect: 'postgres',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production'
      ? { require: true, rejectUnauthorized: false }
      : false,
  },
};
