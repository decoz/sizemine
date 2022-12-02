import dot from '/imemine/js/dot.js'

export default class dRate extends HTMLElement {

  attrs = ['css', 'max', 'symbol']
  value = 0
  max = 5
  symbol = '⭐'

  Get() {
    return this.value
  }

  Put(v) {

    this.value = parseInt(v)
    console.log('put value:',this.value)
    for(let i=0; i < this.max; i++ ){
      let span = this.shadowRoot.getElementById('rating'+i)
      if( i < this.value )   span.className = 'on'
      else span.className = 'off'

    }

  }

  connectedCallback(){
    for(let attr of this.attrs){
      if( this.hasAttribute(attr) )
        this[attr] = this.getAttribute(attr)
    }

    this.attachShadow({mode:'open'})
    let sroot = this.shadowRoot

    sroot.innerHTML += this.defaultcss
    if( this.css ) this.shadowRoot.innerHTML += '<style>\n' + this.css  + '\n</style>'

    for( let i=0; i<this.max; i++) {
      let span = document.createElement('span')
      span.className = 'off'
      span.innerText = this.symbol
      span.id = 'rating'+i
      sroot.appendChild(span)
    }

  }

  defaultcss = `
  <style>
  :host span.off {
    color: transparent;
    text-shadow: 0 0 0 #f0f0f0;
  }

  :host span.on {
    color: transparent;
    text-shadow: 0 0 0 #ec6517;
  }
  </style>
  `


}
