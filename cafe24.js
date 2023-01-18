const express = require('express')
const router = express.Router()
const path = './html/cafe24Admin/'
const ejs = require('ejs')

const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host:'54.180.149.190',
  port:3306,
  user:'decoz',
  password:'wkdghehd',
  connectionLimit:5
})

router.route('/test').get( (req,res) =>{
  res.send('test output ')
} )


router.route('/auth').get( (req,res) =>{
  require(path + 'auth.js')

  const { code } = req.query

  var request = require("request");
  var appId = Buffer.from("TCYH6aIoJtAgdorhgmwCsB:n9JSjKBHKBwnINqEcoNAaC", "utf-8").toString("base64")

  var payload = 'grant_type=authorization_code&code='+code+'&redirect_uri=https://sizemine.co.kr/cafe24/index';
  var options = { method: 'POST',
    url: 'https://parkisoo.cafe24api.com/api/v2/oauth/token',
    headers: {
      'Authorization': "Basic "+appId,
      'Content-Type': "application/x-www-form-urlencoded"
    },
    body: payload,
    json: true
  };

  request(options, async function (error, response, body) {
    if (error) throw new Error(error);

    options = {
        uri: `https://sizemine.co.kr/cafe24/put?access_token=${body.access_token}&refresh_token=${body.refresh_token}`
    };

    request.get(options, async function (error, response, body) {
        if (error) throw new Error(error);

        res.writeHead(302, {"Location" : "https://sizemine.co.kr/cafe24Goods?state=admin"});
        res.end();
    });

  });

})

router.route("/put").get( async function(req, res){

  const {access_token, refresh_token} = req.query

  if(access_token && refresh_token){
    let conn = await pool.getConnection()
    conn.query('use sizemine')
    let query = `UPDATE itb_cafeToken SET access_token = "${access_token}", refresh_token = "${refresh_token}" WHERE sno = 1`
    let result = await conn.query(query)
    conn.close()
    res.end();
  }

})

router.route("/get").get( async function(req, res){

  const {state} = req.query

  if(state == 'parkisooCafe24'){
    let conn = await pool.getConnection()
    conn.query('use sizemine')
    let query =  `SELECT * from itb_cafeToken`
    rows = await conn.query(query)
    res.json(rows[0])
    console.log(rows)
    conn.close()
  }

})

module.exports = router
