import dot from "/imemine/js/dot.js"

export default class dPopsel extends HTMLElement {
  onselect = null
  rootli = null
  obj = null
  value = null
  labels = null
  selected = null
  d = null

  attrs = [ 'items', 'css' ]

  constructor() {
    super()
  }

  Put(v) {
    this.value = v
    if(this.labels && this.labels[v])
      this.seltext.innerText = this.labels[v]
    else this.seltext.innerText = v
  }

  putlist(d) {
    //console.log("Put",d.Str())

    let selroot = this.shadowRoot.getElementById('selroot')
    if( !selroot ) {
      selroot = document.createElement("ul")
      selroot.id = 'selroot'
      selroot.className = 'dropdown'
      this.selroot = selroot
    }

    selroot.innerHTML  = "<li> <a id = seltext >" + this.text + "</a> </li>"

    this.shadowRoot.appendChild(selroot)
    let rootli = selroot.children[0]
    this.seltext = rootli.children[0]


    this.d = d
    let ul = document.createElement("ul")
    if( d.v == "" ){
      for(let c of d.c) ul.appendChild( this._build(c) )
    } else ul.appendChild( this._build(d) )

    rootli.appendChild(ul)
  }

  createItem(v) {
    let li = document.createElement("li")

    let txt = ( this.labels && this.labels[v] ) ? this.labels[v] : v
    li.innerHTML = "<a value = '" + v + "'>"+ txt + "</a>"

    li.addEventListener('click', e => {
      this.value = e.srcElement.getAttribute("value")
      this.seltext.innerText = e.srcElement.innerText
      console.log(this.value, e.srcElement)

      if( typeof(this.onselect) == 'function')
        this.onselect(value)
    })
    return li
  }

  _build(d){

    let li = this.createItem(d.v)

    if( d.c.length > 0 ) {
      let ul = document.createElement("ul")
      for(let c of d.c )
        ul.appendChild( this._build(c) )
      li.appendChild(ul)
    }
    return li

  }

  connectedCallback(){
    //console.log("create popupsel:",this.innerHTML)
    this.text = this.innerText
    this.attachShadow({mode:'open'})

    for(let attr of this.attrs){
      if( this.hasAttribute(attr) )
        this[attr] = this.getAttribute(attr)
      else  this[attr] = null
    }

    if( this.css ) this.shadowRoot.innerHTML += this.css
    this.shadowRoot.innerHTML += this.csstyle;

    if( this.items ){
      let itemtxt = this.getAttribute('items')
      let items = JSON.parse(itemtxt)
      this.Put(dot.fromObj(items))
    }
  }

  csstyle = `
  <style>

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }

  body {
    font-family: sans-serif;
    margin: 0;
    padding: 10px;
  }

  .dropdown {
    margin: 0;
    padding: 0;
    list-style: none;
    width: 200px;
    background-color: #AAAAAA;
  }

  .dropdown li {
    z-index: 10;
    position: relative;
  }

  .dropdown li a {
    color: #ffffff;
    text-align: center;
    text-decoration: none;
    display: block;
    padding: 10px;
  }

  .dropdown li ul {
    position: absolute;
    top: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
    display: none;
    line-height: normal;
    background-color: #333;
  }

  .dropdown li ul li a {
    text-align: left;
    color: #cccccc;
    font-size: 14px;
    padding: 10px;
    display: block;
    white-space: nowrap;
  }

  .dropdown li ul li a:hover {
    background-color: #AAAAAA;
    color: #ffffff;
  }

  .dropdown li ul li ul {
    left: 100%;
    top: 0;
  }

  ul li:hover>a {
    background-color: #888888;
    color: #ffffff !important;
  }

  ul li:hover>ul {
    display: block;
  }
  </style>
  `
}
