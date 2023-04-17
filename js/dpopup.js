export default class dPopup extends HTMLElement {

  constructor() {
    super()
  }

  attrs = ['srcurl', 'css', 'html', 'title', 'showframe', 'btn_ok', 'btn_cancel']
  popup = null
  showframe = true
  on_ok = null

  setInitData(value){
    let iframe = this.getframe()
    iframe.addEventListener("load", function (e) {
      iframe.contentWindow.window.postMessage(value)
    });
  }

  getframe(){
    return this.shadowRoot.getElementById('content')
  }

  close(){
    this.style.display = 'none'
  }

  open(src_url){

    let src = src_url?src_url:this.srcurl;
    console.log(src)

    if(src) {
      let content = this.shadowRoot.getElementById('content')
      let header = this.shadowRoot.getElementById('header')
      if(this.css)  content.style.cssText += this.css
      if(this.title) header.innerText = this.title


      if(this.showframe == 'false') {
        this.popup = this.shadowRoot.getElementById('popup')
        let footer = this.shadowRoot.getElementById('footer')
        header.style.display = 'none'
        this.popup.style.border = 'none'
        content.style.border = 'none'
        footer.style.backgroundColor = "rgba(0,0,0,0)"
        this.popup.style.backgroundColor = "rgba(0,0,0,0)"
      }

      content.src = src_url
      this.style.display = 'block'



      content.onload = e => {
        if( this.btn_ok ) {
          this.shadowRoot.getElementById('default_ok').style.display = 'none'
          let btn = e.srcElement.contentDocument.getElementById(this.btn_ok)
          btn.addEventListener('click', e => {
            if( typeof(this.on_ok) == 'function') this.on_ok()
            this.close()
          })
        }

        if( this.btn_cancel ) {
          this.shadowRoot.getElementById('default_cancel').style.display = 'none'
          let btn = e.srcElement.contentDocument.getElementById(this.btn_cancel)
          btn.addEventListener('click', e => {
            this.close()
          })
        }
      }
    }
  }// end open


  connectedCallback(){

    this.attachShadow({mode:'open'})

    for(let attr of this.attrs)
      if( this.hasAttribute(attr) ){
        this[attr] = this.getAttribute(attr)
        console.log(this[attr])
      }
      else  this['attr'] = null

    this.shadowRoot.innerHTML += this.objhtml
    this.shadowRoot.innerHTML += this.cssstyle

    this.shadowRoot.getElementById('default_ok').addEventListener('click', e => {
      if( typeof(this.on_ok) == 'function') this.on_ok()
      this.close()
    })



  }

  objhtml = `
  <div id = popup >
    <div id = header> </div>
    <iframe id = content > </iframe>
    <div id = footer>
      <button id = default_ok> ok </button>
      <button id = default_cancel> cancel </button>
    </div>
  </div>
  `

  cssstyle = `
  <style>
  :host {
    left:0; top:0;
    width:100%; height:100%;
    background-color:rgba(150,150,150,0.4);
    position:fixed;
    display:none;
    text-align:center;
    veritical-align:middle;
    z-index:2;
  }
  #popup {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color:white;
    border:20px solid #CCCCCC;
    border-radius:10px;
    text-align:left;
    height:auto;
    overflow:hidden;
  }

  div #header {
    font-size:15pt;
    width:100%;
    height:30px;
    color:white;
    background-color:#CCCCCC;

  }

  div #footer {
    text-align:right;
    height:30px;
    width:100%;
    background-color:#CCCCCC;
    padding-top:10px;

  }

  #footer button {
    font-size:11pt;
    border:none;
    background-color:gray;
    color:white;
  }

  iframe #content {
    border:10px solid white;
    border-radius:5px;
    display:block;
    height:80%;
    overflow:scroll;

  }


  </style>
  `


}
