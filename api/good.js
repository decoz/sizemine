const express = require('express')
const router = express()
router.use(express.json())
router.use(express.urlencoded())

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
  const {gid, vid, sizes, tpl_name, tags} = req.body
  console.log("put_good:",gid, vid, sizes, tags)

  let conn = await pool.getConnection()
  conn.query('use sizemine')
  let query =
    `
      INSERT INTO itb_goods(good_id, vendor_id, sizes, tpl_name, tags)
        VALUES("${gid}", "${vid}", "${sizes}", "${tpl_name}", "${tags}")
        ON DUPLICATE KEY UPDATE
        sizes = '${sizes}', tpl_name = '${tpl_name}', tags = '${tags}'
    `
  console.log(query)
  let result = await conn.query(query)
})

router.route("/get").get( async function(req, res){

  const {gid, vid} = req.query
  console.log("get_good:",gid, vid)

  let conn = await pool.getConnection()
  conn.query('use sizemine')
  console.log('typeof gid:',typeof gid)
  if( typeof vid == undefined ) return
  if( typeof gid == 'undefined') {
    let query =  ` SELECT good_id from itb_goods where  vendor_id = '${vid}' `
    rows = await conn.query(query)
    res.json(rows)
    console.log(rows)
    conn.close()
    return
  }



  let query =  ` SELECT * from itb_goods
        where good_id = '${gid}' and vendor_id = '${vid}' `
  console.log(query)
  rows = await conn.query(query)
  res.json(rows[0])
  console.log(rows)
  conn.close()

})

router.route("/getlist").get( async function(req, res){

  const {vid} = req.query
  console.log("get_good:",gid, vid)

  let conn = await pool.getConnection()
  conn.query('use sizemine')
  let query =  ` SELECT * from itb_goods
        where good_id = '${gid}' and vendor_id = '${vid}' `
  console.log(query)
  rows = await conn.query(query)
  res.json(rows[0])
  console.log(rows)
  conn.close()

})






module.exports = router
