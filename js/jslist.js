export default class jsList extends HTMLElement {
  method = 'GET'
  onselect = null
  obj = null
  value = null

  attributes = ['css', 'src']

  constructor() {
    super()
  }

  checkObj(){
    if(!this.obj){
      this.obj = this.shadowRoot.getElementById("mainlist")
      this.obj.addEventListener("change", (e)=>{
        console.log("change:", this.obj.value)
        this.value = this.obj.value
        if(typeof(this.onselect) == 'function') {
          this.onselect(this.obj.value)
        }
      })
    }
    return this.obj
  }

  reloadList(data){
    this.checkObj()
    console.log(data)
    let d = JSON.parse(data)

    this.obj.innerHTML = "";
    for( let i in d )
      this.addOption(d[i], d[i])

    this.obj.setAttribute('size', d.length)
  }

  init(){
    var obj = document.createElement("select")
    obj.id = "mainlist"
    obj.setAttribute("size", 10)
    obj.addEventListener("change", (e)=>{
      console.log("change")
    })


    this.shadowRoot.appendChild(obj)

  }

  addOption(value, text){
    this.checkObj()
    console.log(this.obj)
    var opt = document.createElement("option")
    opt.value = value
    opt.innerHTML = text
    this.obj.appendChild(opt)
  }

  sync(){
    console.log(this.src)
    var it = this
    var xhr = new XMLHttpRequest()
    xhr.addEventListener('readystatechange', (e) => {
      console.log("ready:"+xhr.readyState + "," + xhr.status)

      if (xhr.readyState == 4 && xhr.status == 200) {
        console.log("received")
        it.reloadList(xhr.response)
      } else if (xhr.readyState == 4 && xhr.status != 200) {
        // Error. Inform the user
      }
    })

    console.log(this.method)
    xhr.open( this.method, this.src, false)
    xhr.send()
  }

  connectedCallback(){

    this.attachShadow({mode:'open'})
    let event = new CustomEvent('load');
    this.shadowRoot.dispatchEvent(event);

    this.shadowRoot.addEventListener("load", (e) => {
      console.log("load")
    })

    this.init()

    this.shadowRoot.innerHTML += this.csstyle;
    if( this.hasAttributes('src') ){
      this.src = this.getAttribute('src')
      this.sync()
    }

    if( this.hasAttributes('onselect') ){
      this.onselect = this.getAttribute('onselect')
    }
  }

  csstyle = `
    <style>
    :host {
      all: initial;
      position:relative;
      display: inline-block;
    }

    select {
      padding-top:4px;
      height:400px;
      vertical-align:top;
      margin:10px;
    }
    
    option {
      vertical-align:top;
    }

    </style>
  `
}
