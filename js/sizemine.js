
import dot from '/js/dot.js'
import * as MI from '/js/mineif.js'
var label_url = '/labels.txt'

var sizemine_url = 'https://sizemine.net/bodysize/'
var dlabels = null

var sizearr = null
var dsize = null
var gid, tpl_name
var dtpl, dgsizes, dmeasures
var scorearr

dlabels = dot.tabParse( await MI.promiseGet(label_url) )
//console.log(dlabels.Str())

export default async function upload(file, onupload){
  let upform = new FormData()
  upform.append("file",file)
  let res = await fetch(sizemine_url,{
    method:'POST',
    body: upform
  })

  let txt = await res.text()
  sizearr = JSON.parse( "{" + txt + "}" )
  dsize = dot.fromObj(sizearr)
  //console.log(txt,sizearr)

  if(typeof(onupload) == 'function')
    onupload(sizearr)

  return txt
}

export async function loadUser(uid, vid){
  let url = `/user/get?uid=${uid}&vid=${vid}`
  let data = await MI.promiseGet(url)

  dsize = dot.parse( JSON.parse(data).size )
  console.log('dsize',dsize)
  //console.log('userdata:',res.json())
  return dsize
}

export async function loadGood(gid, vid, withtpl = false){
  let url = `/good/get?gid=${gid}&vid=${vid}`
  let data = await MI.promiseGet(url)


  console.log('load_good:',data)
  if( !data ) return ''

  let rdot = dot.fromObj(JSON.parse(data))

  tpl_name = rdot.Get('tpl_name.').V()
  dgsizes = dot.parse(rdot.Get('sizes.').V())

  console.log(rdot.Str(),tpl_name, dgsizes)
  if(withtpl) await loadTpl(tpl_name)
  return dgsizes

}


export async function loadTags(){
  const data = await MI.promiseGet('/api/tag/list')
  let arr = JSON.parse(data)
  let obj = []
  for( let tag of arr ) {
    if( !obj[tag.path] ) obj[tag.path] = []
    obj[tag.path][tag.id] = tag.name
  }

  return obj
}

export async function loadTpl(tpl_name = tpl_name){

  let url = '/template/get'
  console.log("try to get tpl:",tpl_name)
  let jsobj = {'tpl_name':tpl_name}
  let data = await MI.postJson(url, jsobj)

  //let data = await MI.promiseGet(url)
  //console.log("tpl data",data)
  dtpl = dot.parse( data.dot )
  console.log("dtpl:",dtpl)
  return dtpl
}


function name2value(vmap, str){ // 변수를 vmap 에서 찾아 수치로 변환, 변수명은 알파벳만으로 이뤄져야함

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

export function sortScores(scorearr){
  let arr = scorearr
  for(let i=0; i<arr.length - 1; i++)
    for(let j=0; j < arr.length - i - 1; j++){
      if(arr[j]['fit'] > arr[j+1]['fit'] ) {
        let temp = arr[j]
        arr[j] = arr[j+1]
        arr[j+1] = temp
      }
    }

  return arr
}

export function createMatchScores(dgsizes, dsize, dtpl){

    let ms = dsize.Arr()
    //console.log(dgsizes)
    let gsizes = dgsizes.c.length > 1? dgsizes.Arr() : [dgsizes.Arr()]
    let dmrs = dtpl.Get("measures.")
    let mrs = dmrs.c.length > 1? dmrs.Arr() : [dmrs.Arr()]

    //console.log(gsizes,ms,mrs)

    let gs_scores = []

    let best_size = ''
    let best_err = -1

    for(let gs of gsizes ){

      let gs_score = []
      let keys = Object.keys(gsizes[0])

      gs_score['sname'] = gs['sname']
      gs_score['fit'] = 0

      //console.log(gs.snmae + ":")
      let errsum = 0
      for(let meas of mrs){
        let r1 = name2value(gs, meas['base'])
        let r2 = name2value(ms, meas['comp'])
        let base = r1[0], base_keys = r1[1]
        let comp = r2[0]

        //console.log("eq:",base," : ",comp)

        let base_val = eval(base)
        let comp_val = eval(comp)

        let err = ( base_val - comp_val )
        errsum += Math.abs(err) / (base_val + comp_val)

        base_keys.forEach( k => {
          if( gs_score[k] ) gs_score[k] += err
          else gs_score[k] = err
        })
        gs_score['fit'] += errsum
      }

      gs_scores.push(gs_score)

      if( best_err < 0 || errsum < best_err ) {
        best_err = errsum
        best_size = gs['sname']
      }
    }

    scorearr = gs_scores
    return gs_scores
    //console.log(gs_scores)
}


export function getType(arr = sizearr){

  if(!arr) arr = sizearr

  if(arr.he > arr.ch * 1.1 ) return 0  // 삼각형
  if(arr.ch > arr.wa * 1.2 && arr.he > arr.wa * 1.27 ) return 1  // 모래시계
  if(arr.ch > arr.he * 1.1 ) return 2
  if(arr.ch < arr.he * 1.1 && arr.he < arr.ch * 1.1 ) return 3
  if(arr.wa > arr.he || arr.wa > arr.ch ) return 4

  return -1
}


export {upload, dlabels, dsize, dgsizes, dtpl, scorearr, tpl_name}
