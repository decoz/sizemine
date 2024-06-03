export default class dbSelet extends HTMLElement {

  constructor() {
    super()
  }

  attributes = ['css', 'url', 'labels', 'method', 'selsize' ,'auto']
  auto = false;
  onselect = null
  method = 'GET'
  selsize = 10
  filter = null // filter is function for handle url result
  value = null

  labels = {}

  setLabels(labels){
    this.labels = labels
    for(const opt of this.sel_db.children)
      if(labels[opt.value]) opt.innerText = labels[opt.value]
      else opt.innerText = opt.value

  }

  reloadList(data){
    console.log('dbsel filter', typeof(this.filter), this.filter)
    if( typeof(this.filter) == 'function') data = this.filter(data)
    this.sel_db.innerHTML = ""
    let arr = JSON.parse(data)

    if( Array.isArray(arr) )
      for(const v of arr) this.addOption(v,v)
    else
     for( let k in  arr ) this.addOption(k,arr[k])
  }

  addOption(value, text){
    var opt = document.createElement("option")
    opt.value = value
    opt.innerHTML = text
    this.sel_db.appendChild(opt)
  }


  sync() {
    //var it = this
    var xhr = new XMLHttpRequest()
    xhr.addEventListener('readystatechange', (e) => {
      //console.log("ready:"+xhr.readyState + "," + xhr.status)
      if (xhr.readyState == 4 && xhr.status == 200) {
        //console.log("received select list")
        this.reloadList(xhr.response)
      } else if (xhr.readyState == 4 && xhr.status != 200) {
      }
    })

    xhr.open( this.method, this.url, false)
    console.log('dbselct open:',this.method, this.url)
    xhr.send()
  }

  select(value){
    this.sel_db.value = value
  }

  connectedCallback(){

    this.attachShadow({mode:'open'})

    for(let attr of this.attributes)
      if( this.hasAttribute(attr) ) this[attr] = this.getAttribute(attr) ?? true
      else if( this[attr] == undefined ) this[attr] = null

    this.shadowRoot.innerHTML += this.objhtml
    this.shadowRoot.innerHTML += this.cssstyle
    if(this.css) this.shadowRoot.innerHTML += '<style>' + this.css + '</style>'
    this.sel_db = this.shadowRoot.getElementById('sel_db')

    this.sel_db.onchange = e => {
      this.value = this.sel_db.value
      if( typeof(this.onselect) == 'function')
        this.onselect( this.sel_db.value )
    }

    if(this.selsize ) this.sel_db.setAttribute('size', this.selsize)
    if(this.url && this.auto ) this.sync()
  }


  objhtml = `
    <select  id = sel_db >
    </select>
  `

  cssstyle = `
  <style>
  :host {
    text-align:center;
    all: initial;
    position:relative;
    display: inline-block;
  }
  #sel_db {
    vertical-align:top;
    width:100%;
  }
  </style>
  `



}
