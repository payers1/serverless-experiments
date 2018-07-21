const _ = require('lodash')
const fetch = require('node-fetch')
const cheerio = require('cheerio')

async function getDetailedInfo(pId = '1954138') {
  const url = `https://www.finewineandgoodspirits.com/webapp/wcs/stores/servlet/ProductDisplay?catalogId=10051&storeId=10051&productId=${pId}&langId=-1`
  const d = await fetch(url, {
    method: 'GET'
  }).catch(console.error)
  if (!d) {
    return {}
  }
  const text = await d.text().catch(console.error)
  const $ = cheerio.load(text)
  const productName = $('#name_ga').val()
  const img = $(
    '#leftPanel > div > div:nth-child(4) > div.productVerticalImg > a > img'
  ).attr('src')
  let price = $('#price_ga').val()
  price = _.replace(price, '$', '')
  price = _.toNumber(price)
  const leftPanel = $('#leftPanel > div > div:nth-child(4) > div:nth-child(2)')
  const [label, variety] = leftPanel
    .find('div.topPad > div:nth-child(1)')
    .text()
    .split(':')
    .map(_.trim)
  const [countryLabel, country] = leftPanel
    .find('div.topPad > div:nth-child(2)')
    .text()
    .split(':')
    .map(_.trim)
  const [rLabel, region] = leftPanel
    .find('div.topPad > div:nth-child(3)')
    .text()
    .split(':')
    .map(_.trim)

  const [vLabel, vintage] = leftPanel
    .find('div.topPad > div:nth-child(4)')
    .text()
    .split(':')
    .map(_.trim)
  // const salePrice = leftPanel.find('div.productPrice > div').text()
  const description = $('.product_desc_Txt > p')
    .text()
    .trim()
    .replace(/[^\w\s-,]/gi, '')

  const ratings = $('.balloon > div')
    .map((index, element) => $(element).text())
    .get()

  return {
    description,
    price,
    country,
    region,
    variety,
    vintage,
    img,
    ratings: [...new Set(ratings)]
  }
}

module.exports = getDetailedInfo

getDetailedInfo()
