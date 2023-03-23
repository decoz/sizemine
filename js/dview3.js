import dot from '/js/dot.js'


export default class dView extends HTMLElement {

  _buildTpl(obj){
    if(obj.hasAttribute('dot') && obj.getAttribute('dot') == '#'){
      let tpl = document.createElement('template')
      tpl.innerHTML = obj.innerHTML
      obj.tpl = tpl
    }
    for(let c of obj.children) this._buildTpl(c)
  }

  _put(obj, d){

    //console.log('>>',obj, d)
    if(  ! obj.hasAttribute || ! obj.hasAttribute('dot')) {
      for(let c of obj.children ) this._put(c, d)
      //console.log('\t--')
      return
    }

    let dval = obj.getAttribute('dot')
    let cd = d

    if( dval[0] == '$'){ // replace $$ as this value
      cd = d.Get(dval.substring(1))
      let value = cd.c[0].V()
      obj.innerHTML = obj.innerHTML.replace(/\$\$/g,value)
    } else cd = d.Get(dval)

    if( !cd ) return

    if(obj.hasAttribute('iter')){
      //console.log('iter on')

      const iter = obj.getAttribute('iter')
      let iterobj = obj.querySelector(iter)

      if( obj.hasAttribute('replace') ) {
        for(const c of cd.c ){
          const clone = iterobj.cloneNode(true)
          obj.appendChild(clone)
          this._put(clone, c)
        }

        iterobj.parentElement.removeChild(iterobj)
        return
      }
    }

    if( cd.c.length == 1 && cd.c[0].c.length == 0 ){
      //console.log("put_term:",obj.tagName, cd)
      let value = cd.c[0].v
      if( typeof(obj.Put) == 'function' )
        obj.Put( dot.dec(value) )

      switch( obj.tagName ){
      case 'INPUT':
        obj.value = dot.dec(value)
        break
      case 'IMG':
        obj.src =  dot.dec(value)
        break
      case 'SPAN':
        obj.innerText = dot.dec(value)
        break
      }

    } else {
      //console.log("put_mid:",obj, cd)
      let child = obj.children
      for(let c of child ) this._put(c, cd)
    }
  }

  Put(d){
    this._put(this, d)

  }

  Get(){
    console.log("dGET:")
    var root = new dot("")
    this._get(this, root)
    return root
  }

  _get(obj, pd){


    if( obj.hasAttribute('dot')  ){
      let ds =  obj.getAttribute('dot')

      if( ds == '#'){
          for(let c of obj.children) {
            let d = new dot("")
            this._get(c,d)
            pd.c.push(d)
          }
      } else {
        let d = new dot(ds)
        if( obj.value != undefined ) d.Put("." + dot.enc(obj.value))
        else for(let c of obj.children)
          this._get(c, d)
        pd.c.push(d)
      }
    } else for(let c of obj.children)
      this._get(c, pd)


  }


  connectedCallback(){
    this._buildTpl(this)
  }
}
