const express = require('express')
const router = express.Router()
const path = './html/cafe24Admin/'
console.log('cafe24')

router.route('/auth').get( (req,res) =>{
  require(path + 'auth.js')
  res.json({ message: 'done'})
})

module.exports = router
