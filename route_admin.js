const express = require('express')
const router = express()
const ejs = require('ejs')
const path = './admin/'

console.log('admin request')

let _params = {
  'template' : {
    'tpl_name' : ''
  },
  'tag'  : {
    'tagid' : ''
  }
}

for(const key in _params){
  router.get(`/${key}`, async function(req, res) {

    const params = _params[key]
    for(const k in params)
      req.query[k] && ( params[k] = req.query[k] )

    console.log('admin request',key)
    const html = await ejs.renderFile(path + key + '.htm', params)
    res.send( html )
  })
}

module.exports = router
