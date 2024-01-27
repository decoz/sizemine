const express = require('express')
const router = express()
const ejs = require('ejs')
const cafe24 = require('./cafe24/cafe24')

const path = './apps/cafe24/'
console.log('current cafe24 path is ',__dirname)
//router.use(session({secret: 'sizemine.cafe24', resave: true, saveUninitialized: true}))


router.use('/img', express.static(__dirname + '/cafe24/img'))
router.use('/remote', express.static( __dirname + '/cafe24/remote') )
//router.use('/script', require('./cafe24/srv_script')(cafe24))

router.use('/scriptlist', async (req, res) => {
  const result = await cafe24.getScriptList()
  const installed = eval('('+result+')')

  const html = await ejs.renderFile(path + 'scripts.htm', {
    scripts: JSON.stringify(installed)
  })
  res.send(html)

})

router.use('/refresh', async (req, res) => {
  const result = await cafe24.refreshToken()
  res.send(result)
})

router.use('/request', (req, res)=>{
  const {mall_id} = req.query
  cafe24.mallid = mall_id
  res.send( cafe24.initHtml(mall_id) )
})

router.use('/install', async (req, res)=>{
  const result = await cafe24.getToken()
  await cafe24.load_scripts()
  await cafe24.send_order()
  const install_result = await cafe24.install()

  const redirect_mall = `
    <script type = 'module'>
      location.href = 'https://${cafe24.mallid}.cafe24.com/'
    </script>
  `
  res.send(redirect_mall)
})



router.use('/redirect', async (req, res)=>{
  const {code} = req.query
  cafe24.code = code
  //console.log(`get cafe24 redirect request :${cafe24.mallid} : ${cafe24.code}`)
  const result = await cafe24.getToken()

  await cafe24.load_scripts()
  await cafe24.send_order()
  const install_result = await cafe24.install()


  const redirect_script = `
    <script type = 'module'>
      location.href = 'https://sizemine.co.kr/app/cafe24/'
    </script>
  `


  res.send(redirect_script)

  //const html = await cafe24.page_shop()
  //res.send(html)

})


router.use('/', async (req, res)=>{
  const html = await cafe24.page_shop()
  res.send(html)

})

//require('./cafe24/redirect.js') )
module.exports = router
