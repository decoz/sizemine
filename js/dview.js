import dot from '/imemine/js/dot.js'


export default class dView extends HTMLElement {

    _buildTpl(obj){
      if(obj.hasAttribute('dot') && obj.getAttribute('dot') == '#'){
        console.log("_buildTpl:",obj)
        let tpl = document.createElement('template')
        tpl.innerHTML = obj.innerHTML
        obj.tpl = tpl
      }
      for(let c of obj.children) this._buildTpl(c)
    }

  _put(obj, d){


    if(  ! obj.hasAttribute || ! obj.hasAttribute('dot')) {
      for(let c of obj.children ) this._put(c, d)
      return
    }

    let dval = obj.getAttribute('dot')

    if( dval[0] == '$'){
      let cd = d.Get(dval.substring(1))
      let value = cd.c[0].v
      obj.innerHTML = obj.innerHTML.replace(/\$\$/g,value)
      //console.log( "replace:" + dval.substring(1) + "/" + value, obj.innerHTML.replace(/\$\$/g,value) )

    }

    if( dval == '#' ){
      //console.log('put.#:', obj, d )
      while(obj.children.length > 1 ){
        obj.removeChild( obj.children[1])
      }

      let tpl = obj.tpl
      /*
      let tpl = document.createElement('template')
      tpl.innerHTML = obj.innerHTML
      */
      //console.log(tpl.innerHTML)

      obj.innerHTML = ''
      for( let cd of d.c ) {
        let el = tpl.content.children[0].cloneNode(true)
        obj.appendChild(el )
        this._put( el, cd )
      }
      return
    }

    let cd = d.Get(dval)
    console.log("--put:",obj, cd, d)

    if( !cd ) return

    if( cd.c.length == 1 && cd.c[0].c.length == 0 ){

      //console.log("put_term:",obj.tagName, cd)

      let value = cd.c[0].V()

      if( typeof(obj.Put) == 'function' )
        obj.Put( dot.dec(value) )

      switch( obj.tagName ){
      case 'INPUT':
        obj.value = value
      case 'IMG':
        obj.src =  dot.dec(value)
        break
      case 'SPAN':
        obj.innerText = dot.dec(value)
        break
      }

    } else {
      console.log("put_mid:",obj, cd)
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
    let ds =  obj.getAttribute('dot')
    if( ds  ){
      //console.log("_get:",ds)
      if( ds == '#'){
          for(let c of obj.children) {
            let d = new dot("")
            this._get(c,d)
            pd.c.push(d)
          }
      } else {
        let d = new dot(ds)
        if( obj.value ) d.Put("." + obj.value)
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
