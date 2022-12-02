import dot from '/imemine/js/dot.js'
export default class dColors extends HTMLElement {
  attrs = ['css', 'dvalue']
  Put(d){
    let sroot = this.shadowRoot

    for(let c of d.c){
      let dv = document.createElement("div")
      let cvs = document.createElement("canvas")
      cvs.style.background = c.Get("color.").V()
      let desc = document.createElement('span')
      desc.innerText = c.Get("cname.").V()
      dv.appendChild(cvs)
      dv.appendChild(desc)

      sroot.appendChild(dv)
    }
  }

  connectedCallback(){
    for(let attr of this.attrs){
      if( this.hasAttribute(attr) )
        this[attr] = this.getAttribute(attr)
    }

    this.attachShadow({mode:'open'})
    let sroot = this.shadowRoot
    sroot.innerHTML = this.objhtml
    sroot.innerHTML += this.defaultcss
    if( this.css ) this.shadowRoot.innerHTML += '<style>\n' + this.css  + '\n</style>'

    if(this.dvalue) this.Put(dot.parse(this.dvalue))


  }

  objhtml = `
  `

  defaultcss = `
  <style>
  :host {
    display:flex;
    position:relative;
  }

  :host canvas {
    width:20px;
    height:20px;
    margin-left:5px;
  }

  div > span {
    visibility: hidden;
    position: absolute;
    font-size:0.6em;
    background:#fcfcea;
    padding:0.2em;

  }

  canvas:hover {
    border:1px solid #A55;
  }

  div:hover>  span {
    visibility:visible;
  }

  </style>
  `


}
