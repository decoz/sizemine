import imgMarker from '/imemine/js/imgmarker.js'


if( !customElements.get("img-marker") )
  customElements.define("img-marker", imgMarker)


export default class matchView extends HTMLElement {

  sizes = []
  im = null
  stretch = 3 // default strech
  measures = null
  fontsize = 9

  constructor() {
      super()
  };

  name2value(vmap, str){ // 변수를 vmap 에서 찾아 수치로 변환, 변수명은 알파벳만으로 이뤄져야함
    var word = ""
    var newstr = ""
    for( var i in str){
      if( str[i] >= 'A' && str[i] <= 'z'){
        word += str[i]
      } else {

        if( word.length > 0 ) {
          if(vmap[word]) newstr += vmap[word]
          else newstr += 0
          word = ""
        }
        newstr += str[i]
      }
    }

    if( word.length > 0 )
      if(vmap[word]) newstr += vmap[word]
      else newstr += 0

    return newstr

  }

  compareSizes(json){



  }

  compare(json){ //body size 와 dresssize 를 바꿔 measures 를 측 //

    if( !this.measures ) return false

    var m = this.measures
    var rmap = {}
    for( var k in m ){
      var v1str = this.name2value(this.sizes, k)
      var v2str = this.name2value(json, m[k])
      var v1 = eval(v1str)
      var v2 = eval(v2str)

      rmap[k] = Math.round((v1 - v2) * 100 / v1)

    }

    console.log(rmap)
    return rmap
  }

  setTpl(src, sizes, fontsize){
    var im = document.createElement('img-marker')
    this.im = im

    im.setAttribute('src', src)
    if( sizes ) im.setMarkers( sizes )

    if(!fontsize) fontsize = this.fontsize
    im.setAttribute('fontsize', fontsize)

    this.root.appendChild(im)
    im.redrawMarkers()
  }

  setSize(json){
    for( var k in json ){
        this.sizes[k] = json[k]
    }
    this.im.setValues(json)
    //console.log("sizes:",this.sizes)
  };

  connectedCallback(){
    this.root = this.attachShadow({mode:'open'})
    this.shadowRoot.innerHTML += `
      <style>
      :host {
        all: initial;
        position:relative;
        display: inline-block;
        height:100%
      }
      `

    if( this.hasAttributes('fontsize') )
      this.fontsize = this.getAttribute('fontsize')

    if( this.hasAttributes('template') ){
      var obj = document.createElement('custom-b')
      this.root.appendChild(obj)

      var tpl = JSON.parse( this.getAttribute('template') )

      if( tpl ){
        if( tpl.img ){
          this.setImg( tpl.img, tpl.sizes, this.fontsize )
        }
        if( tpl.stretch ) this.stretch  = tpl.stretch
        this.measures = tpl.measures
      }
    }
  } //connectedCallback



}
