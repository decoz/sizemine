
const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host:'15.164.165.222',
  port:3306,
  user:'decoz',
  password:'wkdghehd',
  connectionLimit:5
})

module.exports = pool
