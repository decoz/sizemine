
export default class dragUpload extends HTMLElement {
  attrs = ['uploadurl', 'showupimg']

  initcontent = ''
  onFileDrop = null
  onUploadResponse = null
  uploadform = new FormData();
  useDialog = true
  uploadurl = ""

  lastfile = null
  files = null

  constructor() {
    super()

  }

  readFile(h_read){
    let reader = new FileReader()
    reader.readAsDataURL(this.files[0])
    reader.onloadend = function() {
      if(typeof(h_read) == 'function'){
        h_read(reader.result)
      }
    }
  }

  uploadValue(key, value){
    this.uploadform.delete(key)
    this.uploadform.append(key, value)
  }

  uploadFile(file){
    console.log(file)
    if(!this.uploadurl) return

    var xhr = new XMLHttpRequest()
    //var formData = new FormData()
    var it = this
    xhr.open('POST', this.uploadurl, true)
    xhr.upload.addEventListener("progress", function(e) {
      //updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
    })

    xhr.addEventListener('readystatechange', function(e) {

      if (xhr.readyState == 4 && xhr.status == 200) {
        if( typeof(it.onUploadResponse) == 'function')
            it.onUploadResponse(xhr.response)
      } else if (xhr.readyState == 4 && xhr.status != 200) {
        // Error. Inform the user
      }
    })
    this.uploadform.delete('file')
    this.uploadform.append('file', file)
    xhr.send(this.uploadform)

  }

  preventDefaults(e){
    e.preventDefault()
    e.stopPropagation()
  }

  highlight(e){
    this.classList.add('highlight')
  }

  unhighlight(e){
    this.classList.remove('highlight')
  }

  showImage(src){
    let dv = this.shadowRoot.getElementById('dv_main')
    dv.innerHTML = "<img src = '" + src + "'>"
  }

  reset(){
    console.log("reset drag")
    let dv = this.shadowRoot.getElementById('dv_main')
    dv.innerHTML = this.initcontent
  }


  h_click(e){

    if(this.useDialog) {
      var input = document.createElement('input');
      input.type = 'file';
      input.onchange = e => {
         var files = [...e.target.files];
         this.files = files

         if(this.showupimg){
           let url = URL.createObjectURL(files[0])
           this.showImage(url)
         }

         if( typeof(this.onFileDrop) == 'function' )
           files.forEach(this.onFileDrop)

         if( this.uploadurl != "" ){
           files.forEach( this.uploadFile.bind(this) )
         }

      }
      input.click();
    }
  }

  h_drop(e){
    let dt = e.dataTransfer
    let files = [...dt.files]
    this.files = files

     if(this.showupimg){
       let url = URL.createObjectURL(files[0])
       this.showImage(url)
     }

    if( typeof(this.onFileDrop) == 'function' )
      files.forEach(this.onFileDrop)

    if( this.uploadurl != "" ){
      files.forEach( this.uploadFile.bind(this) )
    }

  }

  connectedCallback(){

    for(let attr of this.attrs){
      if( this.hasAttribute(attr) )
        this[attr] = this.getAttribute(attr)
      else  this[attr] = null
    }

    this.addEventListener('dragenter', this.highlight, false)
    this.addEventListener('drop', this.h_drop, false)
    this.addEventListener('click', this.h_click, false)
    this.addEventListener('touchstart', this.h_click, false)

    ;['dragleave', 'drop'].forEach( ev => {
      this.addEventListener( ev, this.unhighlight, false)
    })

    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      this.addEventListener(eventName, this.preventDefaults, false)
    })

    this.attachShadow({mode:'open'})

    let cont = this.innerHTML
    if( cont.trim() == "" ) cont = "drag file here"
    this.initcontent = cont
    this.shadowRoot.innerHTML = this.objhtml
    this.shadowRoot.innerHTML += this.css
    let dv_main = this.shadowRoot.getElementById("dv_main")

    dv_main.innerHTML = cont

  }

  objhtml = `
    <div id = dv_main >  </div>
  `

  css = `
  <style>
  :host {
    all: initial;
    color:dimgray;
    font-size:20px;
    text-align: center;
    vertical-align: middle;
    padding: 10px;
    border: 2px dashed #ccc;
    border-radius: 20px;
    display: inline-block;
  }

  #dv_main {
    position:relative;
    height:100%;

  }

  img {
    max-width:100%;
    max-height:100%;
    object-fit: contain;
  }
  :host(.highlight){
    color:white;
    background-color:lightgray;
  }
  </style>
  `

}
