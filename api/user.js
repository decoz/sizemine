const express = require('express')
const router = express.Router()

router.use(express.json())
const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host:'54.180.149.190',
  port:3306,
  user:'decoz',
  password:'wkdghehd',
  connectionLimit:5
})

router.route("/put").post( async function(req, res){
  //console.log('reqbody:',req.body)

  const {uid, vid, size, profile} = req.body
  //console.log("put_user:",uid, vid, size, profile)

  let conn = await pool.getConnection()
  conn.query('use sizemine')
  let query =
   `
      INSERT INTO itb_users(user_id, vendor_id, size, profile)
        VALUES("${uid}", "${vid}", "${size}", "${profile}")
        ON DUPLICATE KEY UPDATE
        size = '${size}',
        profile = '${profile}'
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
