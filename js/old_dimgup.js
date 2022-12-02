import dot from '/imemine/js/dot.js'
export default class dImgUp extends HTMLElement {

  attrs = ['css', 'usefilename']

  ondrop = null


  dfiles = null
  readerwait = 0

  constructor() {
    super()
  }

  Get() {
    return this.dfiles
  }

  addImg(container, src){
    console.log('addimg')
    let updiv = this.shadowRoot.getElementById('updiv')
    let img = document.createElement('img')
    img.src = src
    img.style.width = this.clientWidth
    container.appendChild(img)


  }

  h_drop = e => {
    let dt = e.dataTransfer
    let files = [...dt.files]

    this.dfiles = new dot("")
    this.readerwait = files.length
    console.log(this.readerwait)

    let updiv = this.shadowRoot.getElementById('updiv')
    updiv.innerHTML = ''
    updiv.className = 'showimg'

    let container = document.createElement('div')
    container.className = 'container'
    updiv.appendChild(container)

    files.forEach(file => {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = function () {
        let df = new dot("")
        if(this.usefilename){
          df.Put(".name." + dot.enc(file.name))
          df.Put(".data." + dot.enc(reader.result))
        } else df.Put(dot.enc(reader.result))
        this.dfiles.c.push(df)

        this.addImg(container, reader.result)

        this.readerwait--
        if( !this.readerwait && typeof( this.ondrop ) == 'function' )
          this.ondrop()

      }.bind(this);
    })

    this.files = files
    e.preventDefault()

  }

  preventDefaults(e){
    e.preventDefault()
    e.stopPropagation()
  }

  connectedCallback(){
    for(let attr of this.attrs){
      if( this.hasAttribute(attr) )
        this[attr] = this.getAttribute(attr)
      else  this[attr] = null
    }

    let content = this.innerHTML
    this.attachShadow({mode:'open'})

    this.shadowRoot.innerHTML = this.objhtml
    let updiv = this.shadowRoot.getElementById('updiv')
    if( content.trim() != "" )
      updiv.innerHTML = content

    this.shadowRoot.innerHTML += this.defaultcss

    if( this.css ) this.shadowRoot.innerHTML += '<style>\n' + this.css  + '\n</style>'

    this.addEventListener('drop', this.h_drop, false)
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(ev => {
      this.addEventListener(ev, this.preventDefaults, false)
    })
  }



  objhtml = `
  <div id = updiv class = 'updiv' >
    drag file here
  </div>
  `

  defaultcss = `
  <style>
  :host {
    justify-content: center;
    align-items:center;
    display:flex;

    overflow:hidden;
  }
  #updiv {
    justify-content: center;
    width:100%;
    height:100%;
    color:#CCCCCC;
    border:1px solid #CCCCCC;
    align-items:center;
    border-radius:10px;
    flex-direction: column;
    display:flex;
  }
  .updiv img {
    height:auto
  }

  #updiv.showimg {
    justify-content: left;
  }

  .container {
    position:relative;
    left:0px;
    width:auto;
    display:flex;
  }

  .container:hover {
    border-color:red;
    transition:4s;
    transform:translateX(-100%)
  }

  .container img {
    height:auto;
  }

  </style>
  `



}
