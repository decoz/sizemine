function plus_item(){
  const p = event.srcElement.parentElement
  const input = p.children[1]
  console.log("plut item input:",input)
  input.value++
}

function minus_item(){
  const p = event.srcElement.parentElement
  const input = p.children[1]
  console.log("plut item input:",input)
  input.value--
}

function on_next() {

  adjust_sizeinput()
  next()


}
