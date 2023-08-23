
import dot from '/js/dot.js'
import * as MI from '/js/mineif.js'
var label_url = '/labels.txt'

var sizemine_url = 'https://sizemine.net/bodysize/'
var dlabels = null

var sizearr = null, tagarr = null
var dsize = null
var gid, tpl_name, tagids
var dtpl, dgsizes, dmeasures, dtags, dprofile
var scorearr

dlabels = dot.tabParse( await MI.promiseGet(label_url) )
//console.log(dlabels.Str())

export default async function upload(file, profile, onupload){
  let upform = new FormData()
  dprofile = dot.fromObj(profile)
  upform.append("file",file)
  for(const k in profile) upform.append(k, profile[k])
  let res = await fetch(sizemine_url,{
    method:'POST',
    body: upform
  })

  let txt = await res.text()
  console.log(txt)
  //sizearr = JSON.parse( "{" + txt + "}" )
  sizearr = JSON.parse(txt)
  //console.log(txt,sizearr)
  dsize = dot.fromObj(sizearr)

  if(typeof(onupload) == 'function')
    onupload(sizearr)

  return txt
}

export async function saveUser(){
  console.log('saveUser:', vid, uid, dprofile, dsize)
  const data = {
    'vid' : vid,
    'uid' : uid,
    'profile' : dprofile.Str(),
    'size' : dsize.Str()
  }
  await MI.postJson('/api/user/put', data)

}


export async function loadUser(uid, vid){
  let url = `/api/user/get?uid=${uid}&vid=${vid}`
  let data = await MI.promiseGet(url)
  console.log('user data:',data)
  if( data == '' )  return null

  dsize = dot.parse( JSON.parse(data).size )
  dprofile = dot.parse( JSON.parse(data).profile )
  //console.log('dsize:',dsize, 'dprofile:',dprofile)
  //console.log('userdata:',res.json())
  return dsize
}

export async function loadGood(gid, vid, withtpl = false, withtag = false){
  let url = `/api/good/get?gid=${gid}&vid=${vid}`
  let data = await MI.promiseGet(url)

  console.log('load_good:',data)
  if( !data ) return ''

  let rdot = dot.fromObj(JSON.parse(data))
  tpl_name = rdot.Get('tpl_name.').V()

  tagids = ''
  if( rdot.Get('tags.') ) tagids = rdot.Get('tags.').V()
  console.log('tagids:',tagids)
  //if(tagids != '') console.log('tagids:',tagids)

  //dgsizes = dot.parse(rdot.Get('sizes.').V()).Get('gsize.')
  dgsizes = dot.parse(rdot.Get('sizes.').V())
  console.log(dgsizes.Str())
  console.log(rdot.Str(),tpl_name, dgsizes)
  if(withtpl) await loadTpl(tpl_name)
  if(withtag && tagids != '') await loadTags(tagids)
  return dgsizes

}


export async function loadTaglist(){
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

  let url = '/api/template/get'
  console.log("try to get tpl:",tpl_name)
  let jsobj = {'tpl_name':tpl_name}
  let data = await MI.postJson(url, jsobj)

  //let data = await MI.promiseGet(url)
  //console.log("tpl data",data)
  dtpl = dot.parse( data.dot )
  console.log("dtpl:",dtpl)
  return dtpl
}

function estimate_e(fsize, gsize, strech){
  if( fsize > gsize ) {
    let e = (fsize - gsize) / fsize * 10
    let v = 1 / ( 1 + Math.exp( -e * 10 + strech )) * Math.log(e + Math.E )
    return v
  } else {
    let e = (gsize - fsize) / fsize * 10
    let v = 1 / ( 1 + Math.exp( -e * 10 + 4 )) * Math.log(e + Math.E )
    return v
  }
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

export async function  loadTags(id){ // mrs
  const data = await MI.promiseGet(`/api/tag/get?id=${id}`)
  tagarr = JSON.parse(data)
  dtags = dot.fromObj(tagarr)
  console.log(dtags.Str())

}

function adjustTags(mtable, tarr, bsize){

  const opers = ['+','-','/','*']
  for(const tag of tarr){
    console.log(tag)
    let mods = dot.parse( dot.dec(tag.modifier) ).Arr()
    if(!Array.isArray(mods)) mods = [mods]
    console.log(mods)

    for(const mod of mods) {
      if( !mtable[ mod.size ] && mod.size != 'all' ) continue
      const firstc = mod.value.trim()[0]

      const mval = name2value(bsize, mod.value)[0]
      console.log(mod.size, mtable[mod.size])

      if( opers.includes(firstc) )
        mtable[mod.size] = eval(`${mtable[mod.size]} ${mval}`)
      else mtable[mod.size] = eval(`${mval}`)

      console.log('-->', mtable[mod.size])
    }
  }



}

export function createMatchScores(dgsizes, dsize, dtpl, dtags){
  const bs = dsize.Arr()
  let mrs = dtpl.Get("measures.").Arr()
  if( !Array.isArray(mrs) ) mrs = [mrs]
  const stretch = parseInt( dtpl.Get('stretch.').V() )

  // mtable : expectation sizes , btable : used body sizes for expectation
  let mtable = {}, btable = {}
  for(let meas of mrs){
    const base = meas['base']
    const r = name2value(bs, meas['comp'])
    const val = eval(r[0])
    mtable[base] = val
    btable[base] = r[1]
  }

  dgsizes = dgsizes.Get('gsize.')
  let gsizes = Array.isArray(dgsizes.Arr()) ? dgsizes.Arr() : [dgsizes.Arr()]
  adjustTags(mtable, tagarr, bs)

  let gs_scores = [], best_size = '', best_err = -1
  for(let gs of gsizes ){
    let score = {'fit':0}
    score['sname'] = gs['sname']
    let err = 0
    for(const base in mtable){
      const e =  gs[base] - mtable[base]
      //err +=  Math.abs(e) // ( gs[base] + mtable[base] )

      score[base] = e.toFixed(2)
      score['fit'] += estimate_e(mtable[base],gs[base],stretch)
    }
    gs_scores.push(score)
  }

  console.log('match table result:',mtable, btable, gs_scores)
  return gs_scores
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


export {upload, dlabels, dsize, dgsizes, dtpl, dtags, dprofile, scorearr, tpl_name}
