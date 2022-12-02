export default class tileView extends HTMLElement {
  constructor() {
    super()
  }

  attributes = ['width', 'height', 'css', 'use_select' ]
  selected = -1



  getdiv() {
    return this.shadowRoot.getElementById('dv_main')
  }

  addImg(src) {

    let dv_main = this.shadowRoot.getElementById('dv_main')
    if(this.className == 'empty'){
      dv_main.innerHTML = ''
      this.classList.remove('empty')
    }

    let img = document.createElement("img")
    img.src = src
    if(this.use_select) img.onclick = e => {
      let dv_main = this.shadowRoot.getElementById('dv_main')
      let imgs = dv_main.children

      for(let i = 0; i < imgs.length; i++){
        if(imgs[i] == e.srcElement) {
          this.selected = i
          imgs[i].className = 'selected'
          console.log("selected:",this.selected)
        } else imgs[i].className = ''
      }


    }

    if( this.width ) img.style.width = this.width
    if( this.height ) img.style.height = this.height
    dv_main.appendChild(img)

  }

  connectedCallback(){

    this.attachShadow({mode:'open'})


    let cont = this.innerHTML

    this.shadowRoot.innerHTML = this.objhtml
    this.shadowRoot.innerHTML += this.css
    this.dv_main = this.shadowRoot.getElementById("dv_main")
    this.dv_main.innerHTML = cont

    for(let attr of this.attributes)
      if( this.hasAttributes(attr) )
        this[attr] = this.getAttribute(attr)
      else  this[attr] = null
  }

  objhtml = `
    <div id = dv_main >  </div>
  `

  css = `
  <style>
  #dv_main {
    position:relative;
    width:100%;
    height:100%;
  }

  #dv_main > img{
    margin:10px;
    object-fit:cover;
  }

  #dv_main > img.selected{
    border:2px solid red;
  }


  </style>
  `

}
