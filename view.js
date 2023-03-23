const express = require('express')
const router = express()
const view_path = './views/'

let view_params = {
  'matchmine' : {
    'uid':'decoz',
    'gid':'IM000',
    'vendor_id':'00000'
  },
  'goodmine'  : {
    'gid':'IM000',
    'vendor_id':'00000'
  },
  'sizemine' : {
    'uid':'decoz',
    'vendor_id':'00000'
  },
  'sm2': {

  },
  'sizemine_demo': {

  }
}

router.get('/:view', (req, res) => {
  const view = req.params['view']
  const params = view_params[view]

  if( !view_params[view] ) {
    res.send('bad view request')
    return
  }

  for(const k in params)
    req.query[k] && ( params[k] = req.query )

  console.log(view, params)
  res.render(view + '.htm', params)
})

module.exports = router
