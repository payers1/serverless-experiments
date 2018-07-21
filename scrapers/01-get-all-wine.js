const events = require('events')
const fs = require('fs')
const path = require('path')
const { URL } = require('url')
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

const eventEmitter = new events.EventEmitter()
let pageNum = 1
const pageSize = 15
const dataArray = []
const lastPage = Math.ceil(5069 / 15)

function goToPage(_pageNum, page) {
  return page.evaluate(
    (pNum, pSize) =>
      window.dojo.publish('showResultsForPageNumber', [
        {
          pageNumber: pNum,
          pageSize: pSize
        }
      ]),
    _pageNum,
    pageSize
  )
}

async function onPageRefresh(page) {
  if (pageNum >= lastPage) {
    await page.close()
    eventEmitter.emit('scraping_ended')
    return
  }
  console.log(`SCRAPING PAGE ${pageNum}`)
  const content = await page.content()
  const $ = cheerio.load(content)
  $('div.productImgOne > a').each(async (index, element) => {
    const item = new URL(
      `https://www.finewineandgoodspirits.com/${element.attribs.href}`
    )
    const productId = item.searchParams.get('productId')
    const { title, src } = element.children[1].attribs
    const tag = $(element)
      .find('.ribbon-red')
      .text()
      .trim()
    const { name } = path.parse(src)
    const [productCode, ...rest] = name.split('_')
    dataArray.push({ title, productCode, productId, tag })
  })
  pageNum++
  await goToPage(pageNum, page)
}

async function run() {
  const variety = 'Red'
  const categoryId = '1333936'
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--disable-dev-shm-usage']
  })
  const page = await browser.newPage()
  await page.goto(
    `https://www.finewineandgoodspirits.com/webapp/wcs/stores/servlet/CatalogSearchResultView?storeId=10051&catalogId=10051&langId=-1&categoryId=${categoryId}&variety=${variety}&categoryType=Wines&top_category=25588&sortBy=5&searchSource=E&pageView=&beginIndex=0#facet:10001731103283116111114101&productBeginIndex:0&orderBy:&pageView:&minPrice:&maxPrice:&pageSize:${pageSize}&`
  )

  await page.exposeFunction('CMPageRefreshEvent', e => onPageRefresh(page))

  await page.evaluate(() =>
    dojo.subscribe('CMPageRefreshEvent', CMPageRefreshEvent)
  )

  await goToPage(1, page)

  await waitForScraping()
  await browser.close()
  return dataArray
}

function waitForScraping() {
  return new Promise((resolve, reject) => {
    eventEmitter.once('scraping_ended', () => {
      // When scraping ended mark the promise as fulfilled.
      resolve()
    })
  })
}

module.exports = run
