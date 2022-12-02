
import * as EUC from '/imemine/js/euc.js'
export default class sizeTable extends HTMLElement {

  labels = null
  use_colheader = false

  Put(d){
    let tbl = this.shadowRoot.getElementById('maintable')
    tbl.innerHTML = ''

    let thead = document.createElement('thead')
    let tr = document.createElement('tr')

    let first = d.c[0]

    for(let dh of first.c){
      let th = document.createElement('th')
      if( this.labels && this.labels.hasOwnProperty(this.v) )
        th.innerText = this.labels[dh.v]
      else th.innerText = dh.V()
      tr.appendChild(th)
    }

    thead.appendChild(tr)
    tbl.appendChild(thead)


    for(let rowd of d.c ){
      let tr = document.createElement('tr')
      for(let dh of first.c ){
        let cell = null
        let vd = rowd.Get(dh.v + ".")

        if( this.use_colheader && dh == first.c[0] )
          cell =  document.createElement('th')
        else cell = document.createElement('td')
        if( vd ) cell.innerText = vd.v
        tr.appendChild(cell)
      }
      tbl.appendChild(tr)
    }
  }

  connectedCallback(){

      this.attachShadow({mode:'open'})
      let event = new CustomEvent('load');
      this.shadowRoot.dispatchEvent(event);
      this.shadowRoot.innerHTML += this.objhtml
      this.shadowRoot.innerHTML += this.css

      if( this.hasAttributes('labels') ){
      // not working in euc-kr

        this.lebels = EUC.parse( this.getAttribute('labels') )
        //console.log("labels:",this.getAttribute('labels'))
      }


  }

  objhtml = `
    <table id = maintable >  </table>
  `

  css = `
  <style>
    td {
      width: 350px;
      padding: 10px;
      vertical-align: top;
      border-right: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
    }
    thead th {
      padding: 10px;
      font-weight: bold;
      border-top: 1px solid #ccc;
      border-right: 1px solid #ccc;
      border-bottom: 2px solid #848474;
      background: #dcdcd1;
    }
    th {
      width: 150px;
      padding: 10px;
      font-weight: bold;
      vertical-align: top;
      border-right: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      background: #ececec;
    }
    table {
      font-size:10pt;
      width : 400px;

    }
  </style>
  `

}
