
const express = require('express');
const app = express();
const port = process.env.PORT || 80;
const pool = require('./smdb')
const cors = require('cors')


const statics = { // static file 서비스 폴더
  '/'       : 'html',
  '/js'     : 'js',
  '/css'    : 'css',
  '/images' : 'images',
  '/lang'   : 'lang'
}

const sub_routes = [
  'api',
  'view',
  'admin',
  'app',
]

app.use(cors())
app.set('views', 'views')
app.engine('htm', require('ejs').renderFile);

for(const path in statics) app.use(path, express.static( statics[path] ) )
for(const route of sub_routes) app.use('/' + route , require('./route_' + route) )


app.listen(port, () => {
    console.log(`server is listening at localhost:`+port);
});
