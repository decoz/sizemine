import dot from '/imemine/js/dot.js'
import dFileUp from '/imemine/js/dfileup.js'
import tileView from '/imemine/js/tileview.js'

customElements.define('tile-view', tileView)
export default class dImgUp extends dFileUp {

  attrs = ['css', 'usefilename', 'width', 'height']

  constructor() {
    super()
  }

  ondrop = e => {
    //console.log("imgup drop event ", this.dfiles)
    let dv_up = this.shadowRoot.getElementById('dv_up')

    for(let c of this.dfiles.c)
      dv_up.addImg(c.V())
  }


  swapDom(a,b){
     var aParent = a.parentNode;
     var bParent = b.parentNode;

     var aHolder = document.createElement("div");
     var bHolder = document.createElement("div");

     aParent.replaceChild(aHolder,a);
     bParent.replaceChild(bHolder,b);

     aParent.replaceChild(b,aHolder);
     bParent.replaceChild(a,bHolder);
  }

  mv_selected(dir){
    console.log("mv_selected ",dir)
    let dv_up = this.shadowRoot.getElementById('dv_up')
    let dv_main = dv_up.getdiv()
    let sel = dv_up.selected, swp = sel + dir

    if( sel > -1 && swp > -1 && sel < this.files.length && swp < this.files.length ){
      let clist = dv_main.children
      let files = this.files
      //[dv_main.children[sel], dv_main.children[swp]] = [dv_main.children[swp].cloneNode(true), dv_main.children[sel].cloneNode(true)]
      //[clist[sel], clist[swp]] = [clist[swp], clist[sel]]

      let node1 = dv_main.children[swp]//.cloneNode(true)
      //let node2 = dv_main.children[swp].cloneNode(true)

      //dv_main.replaceChild( dv_main.children[sel], dv_main.children[swp])
      if(dir == 1)  dv_main.insertBefore(  dv_main.children[swp], dv_main.children[sel])
      if(dir == -1)  dv_main.insertBefore( dv_main.children[sel],  dv_main.children[swp])
      //dv_main.replaceChild(node2, dv_main.children[sel])


      dv_up.selected = swp
      console.log(dv_main.children)
      let swpfile = this.files[sel]
      this.files[sel] = this.files[swp]
      this.files[swp] = swpfile

      //, this.files[swp] = [this.files[swp], this.files[sel]]
    }

  }

  del_selected(){
    let dv_up = this.shadowRoot.getElementById('dv_up')
    let dv_main = dv_up.getdiv()
    let sel = dv_up.selected
    //console.log("del_selected", dv_main, dv_main.children[ dv_up.selected ] )
    if(sel > -1)  {
      dv_main.removeChild(dv_main.children[sel])
      this.files.splice(sel,1)
    }

  }

  putdimgs = async function(d){
   let dv_up = this.shadowRoot.getElementById('dv_up')
   for(let dsrc of d.c) {
     let src = dsrc.V()
     dv_up.addImg(src)
     let response = await fetch(src);
      let data = await response.blob();
      let metadata = {
        type: 'image/jpeg'
      };
      let file = new File([data], "test.jpg", metadata);
      this.files.push(file)
   }
  }

  preventDefaults(e){
    e.preventDefault()
    e.stopPropagation()
  }

  objhtml = `
  <tile-view id = dv_up class = 'empty' width = '100px' height = '100px' class = 'updiv' use_select = 'true' >
    drag file here
  </tile-view>
  `
  connectedCallback(){
    super.connectedCallback()
    this.shadowRoot.innerHTML += this.tcss
    let dv_up = this.shadowRoot.getElementById('dv_up')
    if( this.width ) dv_up.width = this.width
    if( this.height ) dv_up.height = this.height

  }

  tcss = `
  <style>
    #dv_up {
      min-height:100px;
      border:1px solid #CCC;
      border-radius:5px;
    }
  </style>
  `

}
