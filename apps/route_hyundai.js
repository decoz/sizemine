const express = require('express')
const router = express()
const ejs = require('ejs')

var options = {
  index: "index.htm"
}


const path = './apps/hyundai/'
router.use("/", express.static(path, options))
router.use('/view', async function(req, res){
  console.log('now render hyundai view')
  const html = await ejs.renderFile(path + 'index.htm', {
    uid:req.uid??'anonymous'
  })
  res.send(html)
})


module.exports = router
