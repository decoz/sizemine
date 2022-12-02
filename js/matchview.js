import imgMarker from '/imemine/js/imgmarker.js'


if( !customElements.get("img-marker") )
  customElements.define("img-marker", imgMarker)


export default class matchView extends imgMarker {

  constructor() {
      super()
  };

  setTpl(d) {
    let image = d.Get('image.').V()
    let tplsizes = d.Get('sizes.')
    this.setMarkers(tplsizes.Arr())
    this.setImg(image)
    //this.redrawMarkers()

  }

  connectedCallback(){
    super.connectedCallback()
  }


}
