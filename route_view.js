const express = require('express')
const router = express()
router.use(express.json())
router.use(express.urlencoded())

const view_path = './views/'

let view_params = {
  'matchmine' : {
    'uid':'decoz',
    'gid':'IM000',
    'vid':'00000'
  },
  'goodmine'  : {
    'gid':'IM000',
    'vid':'00000'
  },
  'sizemine' : {
    'uid':'decoz',
    'gid':'IM000',
    'vid':'00000'
  },
  'sizemine_demo': {
  },
  'sizeminedev':{
    'vid':'00000',
    'gid':'IM000',
    'uid':'decoz',
  }
}

let view_post = {
  'shopmine': {
    'vid':'00000',
    'plist':''
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


for(const view in view_post){
  router.post(`/${view}`, (req, res) => {
    console.log(req.body)
    const params = view_post[view]
    console.log(view, params)

    for(const k in params)
      req.body[k] && ( params[k] = req.body[k] )
    res.render(view + '.htm', params)
  })
}





module.exports = router
