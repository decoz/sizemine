
const express = require('express');
const app = express();
const port = process.env.PORT || 80;
const pool = require('./smdb')

statics = {
  '/'       : 'html',
  '/js'     : 'js',
  '/css'    : 'css',
  '/images' : 'images'
}



/*
async function handleUser(res){
  let conn = await pool.getConnection();
  conn.query('use sizemine')
  let rows = await conn.query('select name from itb_template')
  console.log(rows)
  res.send(rows)
}
*/
app.set('views', 'views')
app.engine('htm', require('ejs').renderFile);

for(k in statics) app.use(k, express.static( statics[k] ) )
app.use('/api', require('./api'))
app.use('/view', require('./view'))


/*
app.use('/', express.static('html'))
app.use('/js', express.static('js'))
app.use('/css', express.static('css'))
app.use('/images', express.static('images'))
*/


app.use('/user', require('./user'))
app.use('/template', require('./template'))
app.use('/good', require('./good'))
app.use('/cafe24', require('./cafe24'))


app.use('/match', (req, res) => {
  res.render('matchmine.htm', {
    vendor_id:req.vendor_id??'00000',
    uid:req.uid??'decoz',
    gid:req.gid??'IM000'
  })
})

app.use('/goodmine', (req, res) => {
  res.render('goodmine.htm', {
    vendor_id:req.vendor_id??'00000',
    gid:req.gid??'IM000'
  })
})

app.use('/hyundai', require('./hyundai'))

app.listen(port, () => {
    console.log(`server is listening at localhost:`+port);
});
