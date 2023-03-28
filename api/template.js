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
  console.log('reqbody:',req.body)

  const {tpl_name, dot} = req.body
  console.log("put_template:",tpl_name)

  let conn = await pool.getConnection()
  conn.query('use sizemine')
  let query =
    `
      INSERT INTO itb_template(tpl_name, dot)
        VALUES("${tpl_name}", "${dot}")
        ON DUPLICATE KEY UPDATE
        dot = '${dot}'
    `
  let result = await conn.query(query)
})


router.route("/list").get( async function(req, res){
  console.log("list_templates:")
  const {field} = req.query
  let conn = await pool.getConnection()
  conn.query('use sizemine')
  let query =  ` SELECT ${field??'tpl_name'} from itb_template `
  let rows = await conn.query(query)
  //console.log("get_template:",tpl_name,query)

  res.json(rows)
  console.log(rows)
  conn.close()
})


router.route("/get").post( async function(req, res){

  //console.log(req.body)
  const {tpl_name} = req.body
  //const {tpl_name} = req.query
  console.log("get_template:",tpl_name)

  let conn = await pool.getConnection()
  conn.query('use sizemine')
  let query =  ` SELECT tpl_name, dot from itb_template where tpl_name = '${tpl_name}' `
  let rows = await conn.query(query)
  //console.log("get_template:",tpl_name,query)

  res.json(rows[0])
  console.log(rows)
  conn.close()
})






module.exports = router
