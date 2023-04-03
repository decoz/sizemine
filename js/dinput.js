/*
  create multiple input by json

  usage :
  <d-input input = '
    (
      data1.text/width:40,
      data2.select/width:40/1 2 3 4 ,
      data3.#(
        x:/width:20px,
        y:/width:20px
      )
    )'>
  </js-input>
*/

import dot from '/js/dot.js'
export default class dInput extends HTMLElement {
  constructor() {
    super()
  }

  attrs = ['labels', 'css', 'input' ]

  img_delbtn = '/imemine/images/btn_del.png'
  img_addbtn = "/imemine/images/btn_add.png"
  labelmap = null

  Struct(d) {
    this.shadowRoot.dpath = ""
    this._struct(this.shadowRoot, d)
    return d
  }


  Put(d){
    this.shadowRoot.childNodes.forEach(node => {
      if(node.nodeName != 'STYLE'){
        this._put(node, d.c)
      }
    })
  }

  clearClones(elm){
    elm.querySelectorAll('template').forEach(tpl =>{
      if(tpl.style.display != 'none')
        tpl.parentElement.removeChild(tpl)
    })
  }

  _put(obj,c){
    console.log(obj,c)
    if(!obj.children) return
    if(obj.hasAttribute('dot')){
      let ds = obj.getAttribute('dot')

      switch(ds){
      case '?':
        if(c.length == 1) obj.value = c[0].V()
        break;

      case '()':
        if(obj.style.display != 'none') break
        let p = obj.parentElement
        this.clearClones(p)
        //console.log(c)
        c.forEach(d => {
          if(d.v == ''){

            let ntpl = p.appendChild(obj.cloneNode(true))
            ntpl.style.display = 'block'
            this.setBtnEvent(ntpl)
            for(let cobj of ntpl.children) this._put(cobj,d.c)
          }
        })
        break
      default:
        c.forEach( d => {
          if(d.v == ds )
            for(let cobj of obj.children) this._put(cobj, d.c)
        })
      }

    } else for( let cobj of obj.children) this._put(cobj,c)

  }

  Get(){
    let d = new dot('')
    this.shadowRoot.childNodes.forEach(node => {
      if(node.nodeName != 'STYLE'){
        this._get(node, d)
      }
    })
    //console.log('dinput Get result', d.Str())
    return d
  }

  _get(obj, d){

    if(!obj.children || obj.style.display == 'none') return

    //console.log(d)
    let newd  = d
    if(obj.hasAttribute('dot')){
      let ds = obj.getAttribute('dot')
      //onsole.log(obj, ds)
      switch(ds){
      case null :
        break
      case '()' :
        newd = new dot('')
        break
      case '?' :
        if(obj.value != '') d.Put("." + dot.enc(obj.value))
        console.log('-*-',obj.value)
        return
      default :
        newd = new dot( ds )
      }
    }

    for(let c of obj.children) this._get(c,newd)
    if( newd != d ){
      let valid = false
      for(let c of newd.c) if(c.v != '' || c.c.length > 0 ) valid = true
      if(valid) d.c.push(newd)

    }
  }

  makeibtn(src ){
    let btn = document.createElement('img')
    btn.src = src
    btn.className = 'imgbtn'
    return btn

  }

  setBtnEvent(elm){
    let btns = elm.querySelectorAll('.imgbtn[src="' + this.img_addbtn + '"]')
    btns.forEach(btn =>{
      btn.onclick = e =>{
        let btn = e.srcElement
        let tplid = btn.getAttribute('tplid')

        let tpl = btn.parentElement.parentElement.querySelector('template')
        let ntpl = tpl.parentElement.appendChild(tpl.cloneNode(true))
        ntpl.style.display = 'block'
        this.setBtnEvent(ntpl)
      }
    })


    btns = elm.querySelectorAll('.imgbtn[src="' + this.img_delbtn + '"]')
    btns.forEach(btn =>{
      btn.onclick = e =>{
        let btn = e.srcElement
        let tpl = btn.parentElement
        tpl.parentElement.removeChild(tpl)
      }
    })



  }

  maketbl(arr){
    let tbl = document.createElement('table')
    let tr = document.createElement('tr')
    tbl.appendChild(tr)
    for(let obj of arr ){
      let td = document.createElement('td')
      td.appendChild(obj)
      tr.appendChild(td)
    }
    return tbl
  }

  _struct(p, d) {

    if(d.c.length == 0) {
      let input = this.createInput(d.v)
      input.setAttribute('dot', '?')
      p.appendChild( input )
      return
    }

    switch(d.v){
      case '#':
        let tpl = document.createElement('template')
        tpl.id = "tpl" + p.dpath
        tpl.dpath = p.dpath
        tpl.style.display = 'none'
        tpl.setAttribute("dot", "()")
        for( let c of d.c ) this._struct(tpl,c)
        let dbtn = this.makeibtn(this.img_delbtn)
        tpl.appendChild(dbtn)

        let btn = this.makeibtn(this.img_addbtn)
        btn.setAttribute('tplid', tpl.id)
        btn.onclick = e => {
          let ntpl = tpl.parentElement.appendChild(tpl.cloneNode(true))
          ntpl.style.display = 'block'
          this.setBtnEvent(ntpl)
        }
        p.appendChild(this.maketbl([tpl, btn]))
        btn.onclick()

        break
      case '':
        for( let c of d.c ) this._struct(p,c)
        return
      default:
        let obj = document.createElement('div')
        obj.setAttribute("dot", d.v)

        obj.innerText = this.labelmap && this.labelmap[d.V()] ? this.labelmap[d.V()] : d.V()
        obj.dpath = p.dpath + "." + d.v
        p.appendChild(obj)

        if(d.c.length > 1 || d.c[0].v == '#') {
          for( let c of d.c ) this._struct(obj,c)
          p.appendChild(obj)
        } else this._struct(obj,d.c[0])

    }


  }

  createInput(str){
    let fields = str.split('/')
    let input = null
    let css = ""

    if( fields.length > 1) css = fields[1]
    switch(fields[0]){
      case '':
      case 'text':
        input = document.createElement('input')
        input.style = css
        input.className = 'textinput'
        break
      case 'color':
        input = document.createElement('input')
        input.setAttribute('type', 'color')
        input.style = css
        input.className = 'colorinput'
        break
    }
    return input
  }


  connectedCallback(){
    this.attachShadow({mode:'open'})
    this.shadowRoot.innerHTML += this.css // default css

    for(let attr of this.attrs){
      if( this.hasAttribute(attr) )
        this[attr] = this.getAttribute(attr)
      else  this[attr] = null
    }

    if( this.hasAttributes('css') ){
      this.shadowRoot.innerHTML += '<style> ' + this.getAttribute('css') + '</style>'
    }

    //if( this.hasAttributes('input') ){

    if(this.labels){
      this.labelmap = dot.parse(this.labels).Arr()
      console.log(this.labelmap)
    }

    if( this.input ){
      let txt = this.getAttribute('input')
      let d = dot.parse( this.getAttribute('input'))
      if(d) this.Struct(d)
    }

  }

  css = `
    <style>
    :host {
      all: initial;
      position:relative;
      display:
      inline-block;
    }

    img.imgbtn {
      margin-top:6px;
      margin-left:10px;
      width:20px;
    }

    input[type="color"] {
    	display: block;
    	width: 32px;
    	height: 32px;
    	border: none;
    }

    td {
      padding:3px;
      border-bottom:1px solid gray;
    }
    div {
      padding-left:10px;
      display:inline-block;
      margin-top:5px;
      font-size:10pt;
    }


    .textinput {
      font-family: inherit;
      margin-left:5px;
      margin-right:10px;
      border-bottom: 1px solid gray;
      border-top: 1px solid gray;

    }

    .list {
      margin:10px;
    }

    input {
      font-family: inherit;
       color:gray;
       outline: 0;
       border:1px solid #CCCCCC;
       height:18px;
       padding: 3px 0;
       background: white;
       transition: border-color 0.2s;
    }
    </style>
  `

}
