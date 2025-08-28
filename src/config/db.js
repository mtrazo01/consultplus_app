const { Pool } = require('pg');

const pool = new Pool({
  user: "consultplus_user",
  host: "dpg-d2ns1iripnbc73csqsq0-a.oregon-postgres.render.com",
  database: "consultplus",
  password: "AbQEXFCTxQMDmquXnt3ppBOuovoIwyIM",
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
