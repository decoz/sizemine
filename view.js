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
    'vid':'00000',
    'gid':'IM000',
    'uid':'decoz',
  },
  'sizemine_demo': {
  },
  'sizeminedev':{
    'vid':'00000',
    'gid':'IM000',
    'uid':'decoz',
  }
}

router.get('/', (req, res) => {
  res.render('index.htm')
})

for(const view in view_params){
  router.get(`/${view}`, (req, res) => {
    const params = view_params[view]

    for(const k in params)
      req.query[k] && ( params[k] = req.query[k] )


    console.log(view, params)
    res.render(view + '.htm', params)
  })
}

module.exports = router
