function dot(str){

	this.child = new Array()

	this.AppendChild = function(dot){

		var cnt = this.child.length
		this.child[cnt] = dot

	}

	this.GetChildList = function(){
		return this.child
	}

	this.GetNChild  = function(i){
		return this.child[i]
	}

	this.GetVChild = function(v){
		for(var i in this.child) {
			if(this.child[i].GetValue() == v) return this.child[i]
		}
		return  null
	}

	this.ChildString = function(){
		var str = ""
		for(var i in this.child) {
			if(i > 0)  str += ","
			str += this.child[i].ToString()
		}
		return str
	}

	this.SetValue = function(val){
		this.value  = dot.Enc(val)
	}

	this.GetValue = function(){
		return dot.Dec(this.value )
	}

	this.GetChildCount = function() {
		return  this.child.length
	}

	this.ToString = function(){

		var str = this.value

		var cnt = this.child.length

		if( cnt  == 1 )  str += "."
		if( cnt > 1) str += "("

		for(var i=0;i<this.child.length;i++){
			if( i > 0 ) str += ","
			str  += this.child[i].ToString()
		}

		if(cnt > 1) str += ")"
		return str
	}

	this.GetChild = function(str){
	/*
	 * 2016-05-20 path 가 빈 문자열 "" 일때 자신을 리턴
	 *
	 */
		if(str == "") return this

		var path = str.split(".")
		var cur = this
		for(var i in path){
			var  d =  cur.GetVChild(path[i])

			if( d==null ) return null
			else cur = d

		}
		return cur
	}

	this.GetChildValue = function(){
		var str = ""
		for(var i in this.child) {
			if(i > 0)  str += ","
			str += this.child[i].GetValue()
		}
		return str
	}

	this.value = str
}



dot.Enc = function(str){
	result = ""
	for(var i = 0 ;i  < str.length; i++){
		var c = str[i]
		switch( c ){
			case ',' : result += "&c"
				break;
			case '.' : result += "&d"
				break;
			case '(': result += "&s"
				break;
			case ')': result += "&e"
				break;
			case '&': result += "&&"
				break;
			case ' ': result += "&b"
				break;
			default:  result += c
		}

	}
	return result
}

dot.Dec = function(str){


	result = ""
	var flag = false
	for(var i = 0 ;i  < str.length; i++){
		var c = str[i]
		if(flag){
			switch( c ){
				case 'c' : result += ","
					break;
				case 'd' : result += "."
					break;
				case 's': result += "("
					break;
				case 'e': result += ")"
					break;
				case '&': result += "&"
					break;
				case 'b': result += " "
					break;
				default:  result += c
			}

			flag = false
		}
		else {
			if( c == '&') flag  = true
			else result += c
		}

	}
	return result
}


dot.Create = function(str){

	var root = dot.parse(str)

	if(root.GetChildCount() == 1) {
		return root.child[0]
	}
	else return root

}


dot.parse = function(str){
	//alert("dot.parse:"+str)
	var s = new stack()
	var root = new dot("")
	var cpar = root
	var cobj = root
	var val = ""
	for(var i=0;i < str.length; i++){
		switch( str[i] ){
			case ',' : var obj = new dot(val)
				if(cobj!=null) cobj.AppendChild( obj)
				cobj = cpar
				val = ""
				break;
			case '.' :  var  obj = new dot(val);
				cobj.AppendChild(obj)
				cobj = obj
				val = ""
				break;

			case '(' :  var obj = new dot(val);
				cobj.AppendChild(obj)
				s.push(cpar)
				cpar = obj
				cobj = obj
				val = ""
				break;

			case ')' :  var obj = new dot(val);
				if(cobj != null) cobj.AppendChild(obj)
				cpar = s.pop()
				cobj = null
				val = ""
				break;
			case "\n":
			case "\t":
			case " ":break;

			default :
				val += 	str[i]
				break;

		}

	}

	var obj = new dot(val);
	if(cobj != null) cobj.AppendChild(obj)

	return root

}

function stack(){
	this.arr = new Array()
	this.last = 0
	this.push =  function(obj){
		this.arr[this.last] = obj
		this.last++
	}

	this.pop = function() {
		this.last--
		if( this.last >=0 )  return this.arr[this.last]
		else return null
	}

	this.getlast = function(){
		return this.arr[this.last-1]
	}
}
