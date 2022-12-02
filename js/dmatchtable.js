import dot from "/imemine/js/dot.js"
import dTable from "/imemine/js/dtable.js"

customElements.define('d-table', dTable)
export default class dMatchTable extends HTMLElement {

  sizetable = null
  measures = null
  dsize = null
  mysize = null
  best_size = ''

  constructor() {
    super()
  }

  attributes = ['table_css', 'vertical_table']

  setMeausures(d){ //
    this.measures = d
  }

  setSizes(dsize){ // (sname, .. )
    this.dsize = dsize
    if(this.sizetable) this.sizetable.Put( dsize, 'object' )
  }

  setMySize(d){
    this.mysize = d
  }

  clearTdClass(cname){

    sizetable.shadowRoot.querySelectorAll('td').forEach( td => {
      td.classList.remove(cname)
    })

  }
  setTdClass(row,col,cname){
    //debugger
    let td = sizetable.table.children[row + 1].children[col]
    console.log(td )
    td.classList.add(cname)

  }

  name2value(vmap, str){ // 변수를 vmap 에서 찾아 수치로 변환, 변수명은 알파벳만으로 이뤄져야함

    let vars = []

    let word = ""
    let newstr = ""
    for( let i in str){
      if( str[i] >= 'A' && str[i] <= 'z'){
        word += str[i]
      } else {

        if( word.length > 0 ) {
          if(vmap[word]) {
            newstr += vmap[word]
            vars.push(word)
          }
          else newstr += 0
          word = ""
        }
        newstr += str[i]
      }
    }

    if( word.length > 0 )
      if(vmap[word]) {
        newstr += vmap[word]
        vars.push(word)
      }
      else newstr += 0

    //console.log(newstr , vars)
    return [newstr, vars]
  }

  match(){
    console.log('dmtable match:')
    console.log('good sizes:',this.dsize.Str() )
    console.log('my size:',this.mysize.Str() )
    console.log('measures:',this.measures.Str() )


    let ms = this.mysize.Arr()
    let gsizes = this.dsize.Arr()
    let mrs = this.measures.Arr()


    let gs_scores = []

    this.best_size = ''
    let best_err = -1

    for(let gs of gsizes ){

      let gs_score = []
      let keys = Object.keys(gsizes[0])
      keys.forEach(k => {
        gs_score[k] = 0
      })

      //console.log(gs.snmae + ":")
      let errsum = 0
      for(let meas of mrs){
        let r1 = this.name2value(gs, meas['base'])
        let r2 = this.name2value(ms, meas['comp'])
        let base = r1[0]
        let basel = r1[1]
        let comp = r2[0]
        let compl = r2[1]

        let base_val = eval(base)
        let comp_val = eval(comp)

        let err =( base_val - comp_val ) / (base_val + comp_val )
        errsum += err

        basel.forEach( k => {
          gs_score[k] += Math.abs(err)
        })
        gs_scores.push(gs_score)
        //debugger
        //console.log("eval result:",eval(base) - eval(comp))
      }

      if( best_err < 0 || errsum < best_err ) {
        best_err = errsum
        this.best_size = gs['sname']
      }
    }

    this.adjustScores(gs_scores)
    //console.log('best_size:',this.best_size)
  }

  adjustScores(gs_scores){

    this.clearTdClass('emp')

    let keys = Object.keys(gs_scores[0])
    for(let ki in keys){
      let k = keys[ki]
      let min = gs_scores[0][k]
      let mini = 0
      for(let i in gs_scores )
        if( min > gs_scores[i][k] ) {
          min = gs_scores[i][k]
          mini = i
        }
      if( min < 0.03 && min > 0  ){
        console.log("recommend:",ki,mini)
        this.setTdClass(parseInt(mini),parseInt(ki),'emp')
      }
    }
  }





  connectedCallback(){

    //this.attachShadow({mode:'open'})

    for(let attr of this.attributes){
      if( this.hasAttributes(attr) )
        this[attr] = this.getAttribute(attr)
      else  this['attr'] = null
    }

    this.innerHTML += this.objhtml
    //this.innerHTML += this.css

    this.sizetable = document.getElementById('sizetable')
    this.sizetable.setAttribute('vertical',true)
    //console.log("object:",this.sizetable )


  }

  objhtml = `
  <d-table id = sizetable use_colheader = true use_header = true
    css = "
    <style>
    table {
      border-spacing:0 0px;
      border-top : 2px solid #e0e0e0;
      font-size:10pt;
      width:90%;
    }
    th, td {
      color:#5f5f5e;
      padding:10px;
      border:1px solid #f0efef
    }
    td.emp {
      background-color:#f3e5e0;
    }
    th{

      background-color:#F7F7F7
    }
    td {
      text-align:center;
      width:auto;
    }

    </style>
    ">  </d-table> `


}
