const req = require.main.require('./lib/await-request.js')
const fs = require('fs')

class cafe24 {

  server = `https://sizemine.co.kr/app/cafe24`
  path = './apps/cafe24/'
  mallid =  'parkisoo'
  cid =     'Ir0bFLB4ApvivVsEgDjenB'
  ckey =    'AN7313qWLdxsfuetq12XkM'
  auth_id = Buffer.from( this.cid + ':' + this.ckey).toString("base64")
  api_version = '2023-06-01'
  code = ''
  token =   ''
  refesh_token = ''

  scripts = {}

  urls = {
    redirect:`${this.server}/redirect` //
  }

  constructor() {
    this.load_scripts()
  }

  load_scripts() { // remote 폴더의 해당 스크립트를 읽어서 해쉬값을 생성
    console.log('loading scripts')
    const hasher = require('crypto').createHash('sha384')

    this.scripts = {}
    fs.readdir(this.path + 'remote/', (err, files) => {
      for(const f of files ){
        console.log(f)
        const buff = fs.readFileSync(this.path + 'remote/' + f)
        hasher.update(buff, 'utf-8')
        const hash = 'sha384-' + hasher.digest('base64')
        this.scripts[f] = hash
      } //for

      console.log(JSON.stringify(this.scripts))
    })


  }



  initHtml(mall_id){ // 앱이 등록될때 노출되는 페이지 cafe24 에 redirect url 을 건네주고 redirect url ㅇ에서 token 을 받아 처리하도록 해줌
    const scope = `mall.read_application,mall.write_application,mall.read_customer,mall.read_product`
    const url = `https://${mall_id}.cafe24api.com/api/v2/oauth/authorize?`
      + `response_type=code&client_id=${this.cid}&state=decozmine&`
      + `redirect_uri=${this.urls.redirect}&scope=${scope}`

    const html = `
      <script  type = 'module'>
          location.href='${url}';
      </script>
    `
    return html
  }

  store_token(result) {
    const token_info =  eval(result)
    this.token = token_info.access_token
    this.refresh_token = token_info.refresh_token

  }

  async getScriptList(){ // 쇼핑몰에 설치된 script 들을 가져옴
    var req_options = {
        method: 'GET',
        url: `https://${this.mallid}.cafe24api.com/api/v2/admin/scripttags`,
        headers: {
          'Authorization': 'Bearer ' + this.token,
          'Content-Type': "application/json",
          'X-Cafe24-Api-Version': `${this.api_version}`
        }
    }
    console.log(req_options)
    const result = await req(req_options)
    console.log(result)
    return result

  }

  async install_script(f) { // cafe24 에 스크립트를 설치요청을 전송
    const location = f.split('.')[0].toUpperCase()
    const src = 'https://sizemine.co.kr/app/cafe24/remote/' + f
    const hash = this.scripts[f]
    console.log(`${f}: ${location} / ${hash}`)

    var request = require("request");
    var payload = {
        "shop_no": 1,
        "request": {
            "src": src,
            "display_location": [
                location
            ],
            "exclude_path": [

            ],
            "skin_no": [
            ],
            "integrity": hash
        }
    }

    var options = { method: 'POST',
      url: `https://${this.mallid}.cafe24api.com/api/v2/admin/scripttags`,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': "application/json",
        'X-Cafe24-Api-Version': this.api_version
      },
      body: payload,
      json: true
    };
    const result = await req(options)
    console.log(result)
  } // install_script

  async remove_script(script_no) { // 해당 번호의 스크립트를 제거요청을 전송
    var options = {
      method: 'DELETE',
      url: `https://${this.mallid}.cafe24api.com/api/v2/admin/scripttags/${script_no}`,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': "application/json",
        'X-Cafe24-Api-Version': this.api_version
      }
    };

    const result = await req(options)
  }


  async install() {
      const result = await this.getScriptList()
      const installed = eval('('+result+')')
      await this.installScripts(installed)
  }

  async installScripts(installed) { // 대상 쇼핑몰에 업데이트 된 구 스크립트를 제거하고 업데이트되거나 설치 안된 스크립트를 설치
    const list = installed.scripttags

    var exist = []
    for(const s of list){
      console.log(s.script_no, s.src, s.integrity)
      const f = s.src.split('/').at(-1)
      if( s.integrity != this.scripts[f] )
        this.remove_script(s.script_no)
      else exist.push(f)
    }

    for(const f in this.scripts)
      if( !(f in exist) ) this.install_script(f)

  }

  async refreshToken() { // 토큰이 만료된 경우 새로운 토큰을 새로 받아옴 
    var payload = `grant_type=refresh_token&code=${this.code}`
                  + `&refresh_token=${this.refresh_token}`
    var req_options = {
        method: 'POST',
        url: `https://${this.mallid}.cafe24api.com/api/v2/oauth/token`,
        headers: {
          'Authorization': 'Basic ' + this.auth_id,
          'Content-Type': "application/x-www-form-urlencoded"
        },
        body: payload,
        json: true
    }

    //console.log(req_options)

    const result = await req(req_options)
    this.store_token(result)
    return result

  }



  async getToken() { // token 정보를
    var app_auth = Buffer.from( this.cid + ':' + this.ckey).toString("base64")

    var payload = `grant_type=authorization_code&code=${this.code}`
                  + `&redirect_uri=https://sizemine.co.kr/app/cafe24/index`

    var req_options = {
        method: 'POST',
        url: `https://${this.mallid}.cafe24api.com/api/v2/oauth/token`,
        headers: {
          'Authorization': 'Basic ' + app_auth,
          'Content-Type': "application/x-www-form-urlencoded"
        },
        body: payload,
        json: true
    }

    const result = await req(req_options)
    this.store_token(result)

    return result

  } // getToken


}

module.exports = new cafe24()
