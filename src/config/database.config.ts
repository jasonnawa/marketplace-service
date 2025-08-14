export default () => ({
  database: {
    dialect: 'postgres' as const,
    host: process.env.NODE_ENV === 'development' ? 'localhost' : process.env.POSTGRES_HOST,
    port: +(process.env.POSTGRES_PORT || 5432),
    username: process.env.POSTGRES_USER || 'nestuser',
    password: process.env.POSTGRES_PASSWORD || 'nestpass',
    name: process.env.POSTGRES_DB || 'nestdb',
  },
});
