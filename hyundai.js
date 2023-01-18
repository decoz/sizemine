const express = require('express')
const router = express()
const ejs = require('ejs')

var options = {
  index: "index.htm"
};

router.use("/", express.static('./html/hyundai', options))
router.use("/view", async function(req, res){
  console.log('now render hyundai view')
  const html = await ejs.renderFile('/opt/www/html/hyundai/index.htm', {
    uid:req.uid??'anonymous'
  })
  res.send(html)
})

router.use("/new", async function(req, res){
  console.log('now render hyundai new view')
  const html = await ejs.renderFile('/opt/www/html/hyundai/new.htm', {
    uid:req.uid??'anonymous'
  })
  res.send(html)
})

/*
router.use("/css", express.static('./html/hyundai/css', options))
router.use("/images", express.static('./html/hyundai/images', options))
*/

module.exports = router;
