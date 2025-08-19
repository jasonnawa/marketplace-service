export default () => ({
  database: {
    dialect: 'postgres' as const,
    host: process.env.POSTGRES_HOST || 'postgres',
    port: +(process.env.POSTGRES_PORT || 5432),
    username: process.env.POSTGRES_USER || 'nestuser',
    password: process.env.POSTGRES_PASSWORD || 'nestpass',
    name: process.env.POSTGRES_DB || 'nestdb',
  },
});
