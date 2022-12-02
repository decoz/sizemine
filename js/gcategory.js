import dPopsel from '/imemine/js/dpopsel.js'
import dot from "/imemine/js/dot.js"


customElements.define('d-popsel', dPopsel)

export default class gCategory extends dPopsel {

  getCategory(){
    //console.log("getCategory")
    var it = this
    let xhr = new XMLHttpRequest()
    xhr.open('POST', "/imemine/categorytree.php", true)
    xhr.addEventListener('readystatechange', function(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        //console.log(this.response)
        let pop = it.shadowRoot.getElementById('pop')
        let json = JSON.parse(this.response)
        //console.log(json)
        it.labels = json['name']
        it.putlist(dot.fromObj(json['tree']))
      }
    })
    xhr.send()
  }

  connectedCallback(){
    super.connectedCallback()
    this.getCategory()
  }


}
