import dot from '/js/dot.js'

export default class dTable extends HTMLElement {

  labels = null
  use_key = false
  attrs = ['use_header', 'use_colheader', 'vertical', 'labels', 'css', 'use_key' ]
  table = null
  vertical = false

  createTable(mat){
    console.log("mat:",mat)
    //let mat = this.tblarr(arr, this.vertical)
    let tbl = this.shadowRoot.getElementById('maintable')
    tbl.innerHTML = ''
    for(let y=0; y < mat.length; y++){
      let tr = document.createElement('tr')
      for(let x=0; x < mat[y].length; x++){
        let tag = "td"
        if( this.use_header && y == 0 ) tag = "th"
        if( this.use_colheader && x == 0 ) tag = "th"
        let el = document.createElement(tag)
        let v = mat[y][x]

        if(tag == "th" && this.labels && this.labels[v] )
          el.innerText = this.labels[v]
        else el.innerText = v

        tr.appendChild(el)
      }
      tbl.appendChild(tr)
    }
  }

  tblarr(arr, vertical = false){
    let use_header =  this.use_header ?  this.use_header : true

    //let h = arr.length, w = arr[0].length
    let headers = [], mat = []
    for(let k in arr[0]) headers.push(k)
    console.log('tblarr header:', headers)

    if(vertical){
      for(let k of headers) {
        let line = [k]
        for(let l of arr)
          line.push(  l[k]? l[k] : '' )
        mat.push(line)
      }
    } else {
      mat.push(headers)
      for(let l of arr){
        let line = []
        for(let k of headers)
          if(l[k]) line.push(l[k])
        mat.push(line)
      }
    }

    return mat
  }

  Put(d, use_key ){
    let arr = d.Arr()
    if( this.use_key ) arr = this.tblarr(arr, this.vertical)
    this.createTable(arr)

  }

  connectedCallback(){

    this.attachShadow({mode:'open'})

    let init_dot = dot.parse( this.innerHTML )
    console.log(this.innerHTML, init_dot.Str())
    this.innerHTML = ""

    this.shadowRoot.innerHTML += this.objhtml
    this.shadowRoot.innerHTML += this.css

    for(let attr of this.attrs){
      if( this.hasAttribute(attr) )
        this[attr] = this.getAttribute(attr) != '' ?
          this.getAttribute(attr) : true
      else if(this[attr] == undefined ) this[attr] = null
    }

    if(this.labels) this.labels = dot.parse(this.labels)

    if( this.css ) {
      this.shadowRoot.innerHTML += this.css
    }
    if( init_dot )  this.Put(init_dot, this.use_key)
    this.table = this.shadowRoot.getElementById('maintable')
  }

  objhtml = `
    <table id = maintable >  </table>
  `

  css = `
  <style>
  td {
    width:auto
  }
  </style>
  `

}
