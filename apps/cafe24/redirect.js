const cafe24 = require('./conn')
const express = require('express')
const router = express()


const client_id = 'Ir0bFLB4ApvivVsEgDjenB'
const clinet_key = 'Tz6PZLsWIRPrfJbh1CX6FD'

router.use('/', async function(req, res){

  console.log('get cafe24 redirect request :')
  const { code } = req.query
  const result = await cafe24.getToken(code)
  res.send(result)

  /*
  var request = require("request");
  //var auth = Buffer.from(`${client_id}:${clinet_key}`, "utf-8").toString("base64")

  var auth = Buffer.from(`Ir0bFLB4ApvivVsEgDjenB:Tz6PZLsWIRPrfJbh1CX6FD`, "utf-8").toString("base64")

  //console.log('code:',code,'appId:',appid)
  console.log(auth)

  var payload = `grant_type=authorization_code&code=${code}&redirect_uri=https://sizemine.co.kr/cafe24/index`

  var req_options = {
    method: 'POST',
    url: 'https://parkisoo.cafe24api.com/api/v2/oauth/token',
    headers: {
      'Authorization': 'Basic ' + auth,
      'Content-Type': "application/x-www-form-urlencoded"
    },
    body:payload,


    json: true
  };


  request(req_options, async function (error, response, body) {
    if (error) throw new Error(error);
    msg = `get access token:${body.access_token} refesh_token:${body.refresh_token}`

    console.log(msg)
    res.send(body)

  });
  */

})
module.exports = router
