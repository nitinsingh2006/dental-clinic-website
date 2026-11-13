const mysql = require("mysql2/promise");

function sslConfig() {
  if (process.env.DB_SSL !== "true") return undefined;
  const ssl = { minVersion: "TLSv1.2", rejectUnauthorized: true };
  if (process.env.DB_SSL_CA) ssl.ca = process.env.DB_SSL_CA;
  return ssl;
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "dental_clinic",
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true,
  ssl: sslConfig(),
});

module.exports = pool;
