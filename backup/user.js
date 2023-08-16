const express = require('express')
const router = express.Router()
const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host:'54.180.149.190',
  port:3306,
  user:'decoz',
  password:'wkdghehd',
  connectionLimit:5
})

router.route("/put").post( async function(req, res){

  const {uid, vendor_id, size} = req.query
  console.log("put_user:",uid, vendor_id, size)

  let conn = await pool.getConnection()
  conn.query('use sizemine')
  let query =
    `
      INSERT INTO itb_users(user_id, vendor_id, size)
        VALUES("${uid}", "${vendor_id}", "${size}")
        ON DUPLICATE KEY UPDATE
        size = '${size}'
    `
  let result = await conn.query(query)
  conn.close()
})

router.route("/get").get( async function(req, res){

  const {uid, vid} = req.query
  console.log("get_user:",uid, vid)

  let conn = await pool.getConnection()
  conn.query('use sizemine')
  let query =  ` SELECT * from itb_users
        where user_id = '${uid}' and vendor_id = '${vid}' `
  rows = await conn.query(query)
  console.log(rows)
  res.json(rows[0])
  conn.close()

})






module.exports = router
