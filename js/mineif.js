

export default function getData(url, func){
  console.log("getData from ",url)
  var xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.addEventListener('readystatechange', (e) => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      if( typeof(func) == 'function') func(xhr.response)
    }
  })
  xhr.send()
}



export function promiseGet(url){
  return new Promise((resolve, reject) =>{
    getData(url, data => {
      resolve(data)
    })
  })
}


export async function postJson(url, jsobj){
  let res = await fetch(url, {
    method: "post",
    headers:{
      'Content-Type': 'application/json'
    },
    body : JSON.stringify(jsobj)
  })
  return res.json()
}

export async function postForm(url, form){

  let res = await fetch(url, {
    method: "post",
    headers:{
      'Content-Type': 'application/json'
    },
    body : JSON.stringify(jsobj)
  })
  return res.json()
}




/*
export function promisePost(url, form){
  return new Promise((resolve, reject) =>{
    fetch(url, {
      method : "POST",
      cache: 'no-cache',
      body: form
    }).then( r => {
      if( r.status == 200 ) resolve(r.json())
    })
  })
}

/*
export function promisePost(url, form){
  return new Promise((resolve, reject) =>{
    postData(url, form,  data => {
      resolve(data)
    })
  })
}
*/

export function postData(url, form, func){
  console.log("postData to ",url)
  var xhr = new XMLHttpRequest()
  xhr.open('POST', url, true)
  //xhr.setRequestHeader("Content-type", "multipart/form-data")
  xhr.addEventListener('readystatechange', (e) => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      if( typeof(func) == 'function') func(xhr.response)
    }
  })
  xhr.send(form)
}

export {getData};
