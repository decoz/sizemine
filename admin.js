const express = require('express')
const router = express()
const ejs = require('ejs')
const path = './admin/'

console.log('admin request')

let _params = {
  'template' : {

  },
  'tag'  : {

  }
}

router.get('/:view', async function(req, res) {
  const view = req.params['view']
  if( !_params[view] ) {
    res.send('bad admin request')
    return
  }

  console.log('admin request',view)
  const html = await ejs.renderFile(path + view + '.htm')
  res.send( html )
})

module.exports = router
