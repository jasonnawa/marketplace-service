require('dotenv').config();

module.exports = {
  username: process.env.POSTGRES_USER || 'nestuser',
  password: process.env.POSTGRES_PASSWORD || 'nestpass',
  database: process.env.POSTGRES_DB || 'nestdb',
  host: process.env.NODE_ENV === 'development' ? 'localhost' : process.env.POSTGRES_HOST,
  port: +(process.env.POSTGRES_PORT || 5432),
  dialect: 'postgres',
};
