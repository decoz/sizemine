import dot from '/imemine/js/dot.js'
export default class dFileUp extends HTMLElement {

  attrs = ['css', 'usefilename']

  ondrop = null

  files = []
  dfiles = null
  readerwait = 0


  constructor() {
    super()
  }

  Get() {
    return this.dfiles
  }

  h_drop = e => {
    let dt = e.dataTransfer
    let files = [...dt.files]

    this.dfiles = new dot("")
    this.readerwait = files.length
    console.log(this.readerwait)
    this.files = [...this.files, ...files]
    console.log("images count:",this.files.length)
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

        this.readerwait--
        if( !this.readerwait && typeof( this.ondrop ) == 'function' )
          this.ondrop()


      }.bind(this);
    })

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
    let dv_up = this.shadowRoot.getElementById('dv_up')

    console.log("dfileup:",content)
    if( content.trim() != "" ) dv_up.innerHTML = content

    this.shadowRoot.innerHTML += this.defaultcss
    if( this.css ) this.shadowRoot.innerHTML += '<style>\n' + this.css  + '\n</style>'


    this.addEventListener('drop', this.h_drop, false)
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(ev => {
      this.addEventListener(ev, this.preventDefaults, false)
    })
  }



  objhtml = `
  <div id = dv_up>
    drag file here
  </div>
  `

  defaultcss = `
  <style>
  :host {
    justify-content: center;
    align-items:center;
    display:flex;
  }
  #dv_up {
    width:100%;
  }

  </style>
  `



}
