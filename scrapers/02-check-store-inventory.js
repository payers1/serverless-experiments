const rp = require('request-promise')
const cheerio = require('cheerio')

function checkStoreInventory(productId) {
  const url =
    'https://www.lcbapps.lcb.state.pa.us/webapp/Product_Management/psi_ProductInventory_Inter.asp'
  const options = {
    method: 'POST',
    url,
    qs: { cdeNo: productId },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Origin: 'https://www.lcbapps.lcb.state.pa.us',
      'Cache-Control': 'no-cache'
    },
    form: { strno: '0214' }
  }
  return rp(options).then(res => {
    const $ = cheerio.load(res)
    const unitsInStock = $(
      'body > table:nth-child(6) > tbody > tr:nth-child(4) > td:nth-child(4)'
    )
      .text()
      .trim()
    if (unitsInStock.length === 0) {
      return 0
    }
    const [numberOfUnits] = unitsInStock.split(' ')
    return parseInt(numberOfUnits, 10)
  })
}

module.exports = checkStoreInventory
