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
  const {name, id, path, modifier} = req.body
  console.log("put_tag:",name, id, path, modifier)

  let conn = await pool.getConnection()
  conn.query('use sizemine')
  let query =
    `
      INSERT INTO itb_tag(name, id, path, modifier)
        VALUES("${name}", "${id}", "${path}", "${modifier}")
        ON DUPLICATE KEY UPDATE
        name = '${name}', modifier = '${modifier}'
    `
  let result = await conn.query(query)
  res.send({})

})

router.route("/list").get( async function(req, res){
  console.log("list_tags:")
  const {path} = req.query
  let conn = await pool.getConnection()
  conn.query('use sizemine')

  let where = path ? ` where path = '${path}'` : ``
  let query = 'SELECT * from itb_tag ' + where

  let rows = await conn.query(query)
  console.log("list_tags:", query)

  res.json(rows)
  console.log(rows)
  conn.close()
})


router.route("/get").get( async function(req, res){
  const {id} = req.query

  const ids = id.split(',')
  console.log("get_tags:", ids)
  let conn = await pool.getConnection()
  conn.query('use sizemine')
  /*
  let where = path ?
    ` where path = '${path}' and id = '${id}'` :
    ` where id = '${id}'`
  */

  let where = ''
  for(const i in ids){
    if(where != '') where += ' or '
    where += ` id = '${ids[i]}'`
  }
  where = 'where ' + where

  let query =  ` SELECT * from itb_tag ` +  where
  let rows = await conn.query(query)
  console.log("get_tag:",id,query)

  res.json(rows)
  console.log(rows)
  conn.close()
})

router.route("/del").get( async function(req, res){
  const {path,id} = req.query

  console.log("del_tags:",path, id)
  if(!path) console.log('no path')
  let conn = await pool.getConnection()
  conn.query('use sizemine')
  let where = path ?
    ` where path = '${path}' and id = '${id}'` :
    ` where id = '${id}'`

  let query =  ` delete from itb_tag ` +  where
  let rows = await conn.query(query)
  res.send('done')
  console.log("removed:",id,query)
  conn.close()
})





module.exports = router
