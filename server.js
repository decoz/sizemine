
const express = require('express');
const app = express();
const port = process.env.PORT || 80;
const pool = require('./smdb')
const cors = require('cors')


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
app.use(cors())
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

app.use('/cafe24Goods', (req, res) => {

  var {state, page, key, keyword, categoryNo} = req.query

  var searchWord = '';
  var offset = 0;
  if(!page || page == 1){
      page = 1;
      offset = 0;
  }else{
      offset = (page-1)*10;
  }

  if(key){
      searchWord = '&'+key+'='+encodeURIComponent(keyword);
  }

  if(state == 'admin'){
    var request = require("request");

    var options = {
        uri: `https://sizemine.co.kr/cafe24/get?state=parkisooCafe24`
    };

    request.get(options, function (error, response, body) {
        if (error) throw new Error(error);

        var data = JSON.parse(body)
        var refresh_token = data['refresh_token']

        var appId = Buffer.from("TCYH6aIoJtAgdorhgmwCsB:n9JSjKBHKBwnINqEcoNAaC", "utf-8").toString("base64")
        var payload = 'grant_type=refresh_token&refresh_token='+refresh_token;
        var options = { method: 'POST',
          url: 'https://parkisoo.cafe24api.com/api/v2/oauth/token',
          headers: {
            'Authorization': "Basic "+appId,
            'Content-Type': "application/x-www-form-urlencoded"
          },
          body: payload,
          json: true
        };

        request(options, async function (error, response, body) {
          if (error) throw new Error(error);

          var access_token = body.access_token;

          options = {
              uri: `https://sizemine.co.kr/cafe24/put?access_token=${body.access_token}&refresh_token=${body.refresh_token}`
          };

          request.get(options, async function (error, response, body) {
          });

          var options = { method: 'GET',
            url: 'https://parkisoo.cafe24api.com/api/v2/admin/products/count?order=desc'+searchWord,
            headers: {
              'Authorization': "Bearer "+access_token,
              'Content-Type': "application/json",
              'X-Cafe24-Api-Version': "2022-09-01"
            }
          };

          var counts = 0;
          request(options, function (error, response, body) {
            if (error) throw new Error(error);

            counts = JSON.parse(body).count
            console.log(counts)
            var nowCnt = counts
            var limit = 10

            if(page > 1){
                nowCnt = counts - offset

                var pageCount = Math.ceil(counts/10)

                if(pageCount == page){
                  limit = nowCnt
                }
            }



            var options = { method: 'GET',
              url: 'https://parkisoo.cafe24api.com/api/v2/admin/products?offest='+offset+searchWord+'&limit='+limit+'&order=desc',
              headers: {
                'Authorization': "Bearer "+access_token,
                'Content-Type': "application/json",
                'X-Cafe24-Api-Version': "2022-09-01"
              }
            };

            var goodsData = [];
            request(options, function (error, response, body) {
              if (error) throw new Error(error);

              goodsData = JSON.parse(body).products;
              console.log(goodsData)
              res.render('cafe24Goods.htm', {
                data:goodsData,
                total:counts,
                count:nowCnt,
                page: page,
                key: key,
                keyword: keyword,
                state: state
              })
            });
          });

        });




    });
  }else{
    res.end()
  }




})


app.use('/hyundai', require('./hyundai'))

app.listen(port, () => {
    console.log(`server is listening at localhost:`+port);
});
