/*
  cafe24 상품 상세 삽입 스크립트
  사이즈마인 매칭 가능한 버튼을 삽입하되
  관리자의 경우 상품도 등록 가능하도록 한다.
*/




(


  async function(CAFE24API){

    const product_no = document.body.querySelector('.size_guide_info').getAttribute('product_no')
    const admin_id = CAFE24.SHOP.getAdminID()
    const mall_id = CAFE24API.MALL_ID


    const popup_html = `
      <div id = sizemine_bg >
        <div id = dv_sizemine >
          <iframe id = if_sizemine > </iframe>
          <div id = 'btn_close' >
            닫기
          </div>
        </div>
      </div>
      <style>
      #sizemine_bg {
        left:0; top:0;
        width:100%; height:100%;
        background-color:rgba(150,150,150,0.4);
        position:fixed;
        display:none;
        text-align:center;
        veritical-align:middle;
        z-index:2;
      }

      #btn_close{
        width:20%;
        padding:0.5em;
        background: #D01743;
        color:white;
        margin:auto;
        border-radius:0.5em;
      }

      #dv_sizemine {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        height:60vh;
        width:30vh;
        background-color:white;
        border:20px solid #CCCCCC;
        border-radius:10px;
        text-align:center;
        overflow:hidden;
      }

      #if_sizemine {
        border:10px solid white;
        border-radius:5px;
        display:block;
        width:100%;
        height:90%;
        overflow:scroll;
      }
      </style>
    `

    const sm_html = `
      <div class='dv_sizemine' >
        <div class="btn_wrap" id = btn_sizemine>
          <a class="btn btn_main_02"> 내게 맞는 사이즈인지 확인 </a>
        </div>

      </div>
    `
    const css = `
      <style>
      .dv_sizemine {
        margin-top:0.5em;
        margin-bottom:0.5em;
        text-align:center;
        justify-contnet
      }
      .btn_wrap {
        margin-left:auto;
        margin-right:auto;
        width:50%;
        text-align:center;
        font-weight:bolder;
        border-radius:0.4em;
        padding:0.5em;
        font-size:1.2em;
      }

      #btn_sizemine {
        background:red;
      }

      #btn_sizemine_admin {
        background:#B44;
      }

      .btn_wrap a {
        color:white;
      }
      </style>
    `
    const res = await fetch(`https://sizemine.co.kr/api/good/get?vid=cafe24.${mall_id}&gid=${product_no}`)
    const data = await res.text()

    var is_registered = false
    if( data != '' ) is_registered = true

    CAFE24API.getMemberID(member_id => {

      //alert(`${member_id}/${mall_id}/${product_no}`)


      function popup(url) {
        sizemine_bg.style.display = 'block'
        if_sizemine.src = url
      }

      function popup_close() {
          sizemine_bg.style.display = 'none'
      }


      const admin_msg = is_registered?
        '(관리자) 사이즈마인 상품정보 수정':
        '(관리자) 사이즈마인 상품 등록'
      const admin_html = `
        <div class='dv_sizemine' >
          <div class="btn_wrap" id = btn_sizemine_admin >
            <a class="btn btn_main_02"> ${admin_msg} </a>
          </div>
        </div>
      `

      var html = css + popup_html
      if( is_registered ) html += sm_html
      if( admin_id == member_id ) html += admin_html
      console.log(html)
      $('.totalPrice').after( html  )

      //console.log('??:',sm_url)
      if(is_registered)
        btn_sizemine.addEventListener('click', e => {
          const sm_url = `https://sizemine.co.kr/view/sizemine?gid=${product_no}&uid=cafe24.${member_id}&vid=cafe24.${mall_id}`
          dv_sizemine.style.width = '40vh'
          popup(sm_url)
        })
      if(admin_id == member_id)
        btn_sizemine_admin.addEventListener('click', e => {
          const admin_url = `https://sizemine.co.kr/view/goodmine?gid=gid=${product_no}&uid=cafe24.${member_id}&vid=cafe24.${mall_id}`
          dv_sizemine.style.width = '80vh'
          popup(admin_url)
        })

      btn_close.addEventListener('click', e => {
          popup_close()
      })

    }) // getMemberID

  }(CAFE24API.init({
      client_id : 'AN7313qWLdxsfuetq12XkM',
      version : '2023-06-01'
    }) // init
  )


) //function(CAFE24API)
