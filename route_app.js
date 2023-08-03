const express = require('express')
const router = express()
const app_path = './apps/'

const app_list = [
  'cafe24'
]

for(const app of app_list)
  router.use( '/' + app, require(app_path + 'route_' + app))

module.exports = router
