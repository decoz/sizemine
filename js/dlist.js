import dot from '/imemine/js/dot.js'
import * as MI from '/imemine/js/mineif.js'
export default class dList extends HTMLElement {

  attrs = ['css', 'src', 'kname', 'vname', 'dstr']
  d = null
  getSrc(){
    if(!this.src) return
    MI.getData(this.src, dstr => {
      this.d = dot.parse(dstr)
      this.build(this.d)
      //console.log(d)
    })
  }


  Put(v){
    this.value = v
    this.shadowRoot.getElementById('seltext').innerText = v
  }

  build(d){
    let ul = this.shadowRoot.getElementById('main')

    for(let c of d.c){

      let value = this.vname? c.Get(this.vname+".").V() : c.V()
      let key = this.kname? c.Get(this.kname+".").V() : value
      let li = document.createElement('li')
      li.innerText = value
      li.onclick = e => {
        this.value = li.innerText
        this.shadowRoot.getElementById('seltext').innerText = li.innerText

      }

      ul.appendChild(li)

    }
  }

  constructor() {
    super()
  }

  connectedCallback() {

    this.text = this.innerText
    this.attachShadow({mode:'open'})
    let root = this.shadowRoot

    for(let attr of this.attrs){
      if( this.hasAttribute(attr) )
        this[attr] = this.getAttribute(attr)
      else  this[attr] = null
    }
    let txt = this.innerHTML
    root.innerHTML = this.objhtml
    root.innerHTML += '<style>' +  this.defaultcss + '</style>'

    root.getElementById('seltext').innerText = txt
    if(this.dstr){
      let d = dot.parse(this.dstr)
      this.build(d)
    }

    if(this.src){
       this.getSrc()
    }

  }

  objhtml = `
     <div> <span id = seltext> select </span> <ul id = main> </ul> </div>
  `
  defaultcss = `

    :host {
      position:relative;
    }

    div {
      background:#FFF;
      width:150px;
      padding:0.2em;
      border:1px solid #CCC;
    }
    ul {
      position:absolute;

      margin: 0;
      padding: 0;
      list-style: none;
      background-color: #FFF; }
    ul > li {
      top:100%;
      font-size:0.7em;
      background:#EEE;
      position:ausolute;
      display:none;
    }
    div:hover  li {
      position:relative;
      width:150px;
      display:block;
    }
    li:hover {
      background:#888;
      color:#FFF;
    }
  `


}
