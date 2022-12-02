import popupSel from '/imemine/js/popupsel.js'
customElements.define('popup-sel', popupSel)

export default class gCategory extends HTMLElement {


  getCategory(){
    console.log("getCategory")
    var it = this
    let xhr = new XMLHttpRequest()
    xhr.open('POST', "/imemine/categorytree.php", true)
    xhr.addEventListener('readystatechange', function(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        //console.log(this.response)
        let pop = it.shadowRoot.getElementById('pop')
        let json = JSON.parse(this.response)
        console.log(json)
        pop.labels = json['name']
        pop.setList(json['tree'])
      }
    })
    xhr.send()
  }

  connectedCallback(){
    this.attachShadow({mode:'open'})

    let txt = "category"
    if(this.innerHTML.trim() != "") txt = this.innerHTML
    this.shadowRoot.innerHTML += "<popup-sel id = pop >" + txt + "</popup-sel>"

    if(this.hasAttributes("css")) this.shadowRoot.innerHTML += this.getAttribute("css")


    this.getCategory()
  }


}
