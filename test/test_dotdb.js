//const dotdb = require('../lib/dotdb')
const getConn = require('../lib/sizeminedb')

//console.log(pool)
//const ddb = new dotdb(conn)
async function conn(){
  const conn = await getConn()
  console.log(conn)
}

conn()
