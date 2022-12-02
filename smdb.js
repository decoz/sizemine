
const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host:'54.180.149.190',
  port:3306,
  user:'decoz',
  password:'wkdghehd',
  connectionLimit:5
})

module.exports = pool
