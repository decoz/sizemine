export default class imgMarker extends HTMLElement {

  imgsrc = null
  root = null
  img  = null
  fsize = 9
  markers = {}
  me = this

  constructor() {
      super()
  }

  createMarker(name){
    var marker = document.createElement('div')
    marker.id = name
    marker.className = 'marker'
    marker.innerHTML = name
    return marker
  }

  refreshMarkers() {
    this.root.innerHTML = ""
    //debugger
    this.setImg(this.imgsrc)
  }

  locateMarkers(){
    var m = this.markers
    var w = this.img.width
    var h = this.img.height

    this.root = this.shadowRoot.children[0]
    //alert(this.root.clientWidth + ":" + this.img.src)
    for( var k in m ){
      var obj = this.createMarker(k)
      /*
      console.log( m[i].name + ":" + m[i].pos[0] + "," + m[i].pos[1] +
        "[" + this.root.clientWidth + "," + this.root.clientHeight + "]")
      */
      this.root.appendChild(obj)
      obj.style.left = parseInt( m[k][0] * this.root.clientWidth / w )
      obj.style.top = parseInt( m[k][1] * this.root.clientHeight / h )

    }
  };

  setImg(src) {
    //console.log("setImg:"+src)
    if(!src) return

    
    this.imgsrc = src
    this.img = document.createElement('img')
    this.img.src = src

    var newimg = this.img.cloneNode()

    newimg.onload = function(e){
      var root = this.shadowRoot.querySelector("#imgdiv")
      root.appendChild(newimg)
      this.locateMarkers()

    }.bind(this)

  };

  setFontsize(size){
    if(this.shadowRoot)
        this.shadowRoot.querySelectorAll('.marker').foreach( marker =>{
          marker.style.fontSize = size + 'pt'
        })
    else this.fsize = size
  }

  setValue(name, value) {

    //console.log("im.setValue:",name,value)
    var marker = this.shadowRoot.getElementById(name)
    if( marker ) marker.innerText = value
  };

  setValues(json) {

    for( var k in json){
        this.setValue(k, json[k])
    }
  };

  setMarkers(json) {

    //console.log("set markers :",json)
    for( var k in json ){
      this.addMarker(k, json[k][0], json[k][1] )
    }
  };


  addMarker(name, posx, posy) {

    let wr = 1
    let hr = 1
    if(this.img) {
      wr = this.img.width / this.root.clientWidth
      hr = this.img.height / this.root.clientHeight
    }
    //console.log("addMarker pos ratio:", wr, hr)
    var left = parseInt(posx) * wr
    var top = parseInt(posy) * hr

    this.markers[name] = [left, top]
  };

  readMarker(str) {
    var f = str.split(':')

    if( f.length != 2 ) return false
    var mark_name = f[0].trim()
    var pos = f[1].split(',')
    if( pos.length == 2 ){
        this.addMarker(mark_name, pos[0],pos[1])
    }
  };

  connectedCallback(){
    //this.root = this.shadowRoot.children[0]
    this.attachShadow({mode:'open'})
    var div = document.createElement('div')
    div.id = 'imgdiv'
    this.root = this.shadowRoot.appendChild(div)

    if( this.getAttribute('marker') ){
      var json  = JSON.parse(this.getAttribute('marker'))
      if(json) this.setMarkers(json)
    }

    if( this.hasAttributes('src') ){
      this.setImg(this.getAttribute('src'))
    }


    if( this.hasAttributes('fontsize') ){
      var str = this.getAttribute('fontsize')
      this.fsize = parseInt(str)
    }



    this.shadowRoot.innerHTML += `
      <style>
      :host {
        all: initial;
        position:relative;
        display: inline-block;
        width:100%;
        height:100%;
      }
      #imgdiv {
        width:100%;
        height:100%;
        position:relative;
        display: inline-block;
      }
      img {
        max-width:100%;
        max-height:100%;
        position:relative;
      }
      .marker{
        font-size:`
       + this.fsize +
      `pt;
        position:absolute;
      }
      </style> `

  };



}
