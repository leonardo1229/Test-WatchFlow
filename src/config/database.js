// src/config/database.js
// HIGH PATH: Changes here require config owner review (Watchflow rule: severity high)

const config = {
  development: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'test_watchflow_dev',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    pool: { min: 2, max: 10 },
  },
  production: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: true },
    pool: { min: 5, max: 20 },
  },
};

const env = process.env.NODE_ENV || 'development';
module.exports = config[env];
