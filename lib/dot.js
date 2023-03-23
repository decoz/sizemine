
module.exports =  class dot{
  v = ''
  c = []
  static char_map = []
  static rev_map = []

  constructor(str){
    if(str) this.v = dot.enc(str)
  }

  V(){
    return dot.dec(this.v)
  }

  C(){
    return this.c
  }

  Del(str){
    let td = dot.parse(str)
    if( td.v == "")
      for( let tc of td.c )  this.c.forEach( c=> c._del(this, tc))
    else this.c.forEach( c=> c._del(this, td))
  }

  _del(p, td){

    if(this.v != td.v) return

    //console.log(this.v, td)

    if(td.c.length > 0 )
      td.c.forEach(tc =>{
        this.c.forEach( c => {
          if(tc.v == c.v) tc._del(this, td.c[0])
        })
      })
    else  p.c = p.c.filter( c => c.v != this.v )

  }


  Get(str){
    let cur = this
    let arr = str.split(".")
    let tail = arr[arr.length -1]

    let match = 0
    for( let t of arr )
      for(let d of cur.c)
        if( t != "" && d.v == t  ) {
          cur = d
          match++
          break
        }


    //console.log(str,'->',match, arr)
    if( match == arr.length ) return cur
    else if( match == arr.length - 1 && tail == "" ){
      if( cur.c.length > 1 ){
        let d = new dot("")
        d.c = cur.c
        return d
      } else return cur.c[0]
    }
  }

  Put(str){
    if(str[0] == '.')
      this.c.push( dot.parse(str.slice(1) ))
    else {
      let d = dot.parse(str)
      this.v = d.v
      d.c.forEach( c => { this.c.push(c) })
    }
  }

  Arr(){

    if(this.c.length == 0) {
      //console.log("->",this.v)
      return this.V()
    }

    let arr = []

    let as_obj = true
    for( let c of this.c ) {
      let cobj = c.Arr()
      arr.push(cobj)
      if( cobj.constructor != Object || Object.keys(cobj).length > 1 ) as_obj = false
    }

    if(as_obj){
      let obj = new Object()
      for( let c of arr ){
        for(let k in c ) obj[k] = c[k]
      }
      arr = obj
    } else if(arr.length == 1) arr = arr[0]


    if(this.v == "") return arr
    else {
      let robj = new Object()
      robj[this.v] = arr
      return robj
    }
  }

  Str(){
		let str = this.v
		let cnt = this.c.length
		if( cnt  == 1 )  str += "."
		if( cnt > 1) str += "("

		for(let i=0;i<this.c.length;i++){
			if( i > 0 ) str += ","
			str  += this.c[i].Str()
		}
		if(cnt > 1) str += ")"
		return str
  }

  static dec(str){
  	let result = ""
  	let flag = false
  	for(let i = 0 ;i  < str.length; i++){
  		let c = str[i]
  		if(flag){
        if(c in dot.rev_map ) result += dot.rev_map[c]
  			flag = false
  		}
  		else {
  			if( c == '&') flag  = true
  			else result += c
  		}
  	}
  	return result
  }

  static enc(str){
    let result = ""
    for(let i = 0 ;i  < str.length; i++){
      let c = str[i]
      if(c in dot.char_map) result += '&' + dot.char_map[c]
      else result += c
    }
    return result
  }

  static parse(str){

    let s = []
  	let root = new dot("")
  	let cpar = root
  	let cobj = root
    let obj = null
  	let val = ""
  	for(let i=0;i < str.length; i++){
  		switch( str[i] ){
  			case ',' :
          obj = new dot()
          obj.v = val
  				if(cobj!=null) cobj.c.push( obj)
  				cobj = cpar
  				val = ""
  				break;
  			case '.' : obj = new dot()
          obj.v = val
  				cobj.c.push(obj)
  				cobj = obj
  				val = ""
  				break;

  			case '(' : obj = new dot()
          obj.v = val
  				cobj.c.push(obj)
  				s.push(cpar)
  				cpar = obj
  				cobj = obj
  				val = ""
  				break;

  			case ')' : obj = new dot()
          obj.v = val
  				if(cobj != null) cobj.c.push(obj)
  				cpar = s.pop()
  				cobj = null
  				val = ""
  				break;
  			case "\n":
        case "\r":
  			case "\t":
  			case " ":break;

  			default :
  				val += 	str[i]
  				break;
  		}
    }  // end for

    obj = new dot()
    obj.v = val
  	if(cobj != null) cobj.c.push(obj)

    if( root.v == "" && root.c.length == 1 ) return root.c[0]
  	else return root
  }

  static tabParse(str){
    let lines = str.split('\n')

    let dstack = [[new dot(""), -1]]

    lines.forEach(l => {
      if(!l.length) return

      let depth = 0
      let pre = true
      let w = ''
      for(let c of l )
        if( c == '\t')    depth += 4
        else if(c == ' ') depth += 1
        else break

      let d = null
      let td = null

      //console.log("---",l.length,":",l)

      if( l.trim() == '.' ) {
        td = d = new dot('')
      } else {
        d = dot.parse(l)
        td = d
        while(td.c.length > 0) td = td.c[0]
      }

      let tail = dstack[dstack.length-1]
      while( tail[1] >= depth ) {
        dstack.pop()
        tail = dstack[dstack.length-1];
      }
      tail[0].c.push(d)
      dstack.push([td,depth])
    })

    let root = dstack[0][0]
    if( root.c.length == 1 ) return root.c[0]
    else return root
  }


  static fromObj(obj){

    let d = null
    if(obj == null) return new dot("null")

    switch(obj.constructor){
    case Number:
      return new dot("" + obj)
    case String:
      //console.log("L",obj)
      return new dot(obj)
    case Object:
      d = new dot()
      for(let k in obj ){
        let kdot = new dot(k)
        d.c.push(kdot)
        let vdot = dot.fromObj(obj[k])
        if(vdot.v == ""){
          for(let c of vdot.c ) {
            //console.log("arr push:",c)
            kdot.c.push(c)
          }
        } else kdot.c.push(vdot)
      }
      if(d.c.length == 1) return d.c[0]
      else return d
    case Array:
      d = new dot()
      for(let v of obj )
        d.c.push(dot.fromObj(v))
      return d
    default:
      return String(obj)
    }
  }

  static fromJson(json){
    let obj = JSON.parse(json)
    return dot.fromObj(obj)
  }

}

dot.char_map =  {
  ',':'c',
  '.':'d',
  '(':'s',
  ')':'e',
  '&':'&',
  ' ':'b'
}

for( let k in dot.char_map ){
  dot.rev_map[ dot.char_map[k] ] = k
}
