const express = require('express')
const router = express()
const api_path = './api/'

const api_list = [
  'user',
  'template',
  'good'
]

for(const api of api_list)
  router.use( '/' + api, require(api_path + api))

module.exports = router
