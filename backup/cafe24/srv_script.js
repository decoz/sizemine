const express = require('express')
const ejs = require('ejs')
//const ejs_path = '/opt/www/apps/cafe24/'
const ejs_path = './apps/cafe24/'

module.exports = function(cafe24){
  const router = express()

  router.use('/', async (req, res)=>{

    const result = await cafe24.getScriptList()
    const installed = eval('('+result+')')

    console.log('get script result:',typeof(installed))
    console.log('scripts:',installed)
    //cafe24.installScripts(installed)


    const html = await ejs.renderFile(ejs_path + 'scripts.htm', {
      scripts: JSON.stringify(installed)
    })

    res.send(html)


  })

  router.use('/insert', async (req, res)=>{
    const {location, src} = req.query




  })

  return router
}
