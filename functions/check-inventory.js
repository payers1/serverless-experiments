const _ = require('lodash')
const checkStoreInventory = require('../scrapers/02-check-store-inventory')
const P = require('bluebird')
const Bucket = process.env.BUCKET
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
let data = []

async function getBeginningData() {
  const params = {
    Bucket,
    Key: 'wines.json'
  }
  const { Body } = await s3.getObject(params).promise()
  return JSON.parse(Body.toString())
}

async function checkAll() {
  const jsonData = await getBeginningData()
  let errorCount = 0

  const batches = _.chunk(jsonData, 10)
  console.log('# OF BATCHES', batches.length)

  for (let i = 0; i < batches.length; i++) {
    console.log('RUNNING PAGE', i)
    await P.map(batches[i], async item => {
      if (item.productCode.length === 9) {
        item.inventory = await checkStoreInventory(item.productCode)
      } else {
        item.inventory = 0
      }
      return item
    })
      .then(results => {
        const filtered = results.filter(item => item.inventory > 0)
        data.push(...filtered)
      })
      .catch(() => {
        errorCount++
        console.log('err', errorCount)
      })
  }
  // save all data
  saveAll()
}

async function saveAll() {
  const Body = Buffer.from(JSON.stringify(data, null, ' '), 'binary')
  const Bucket = process.env.BUCKET
  const Key = 'wines-w-inventory.json'
  const params = {
    Body,
    Key,
    Bucket
  }
  await s3.putObject(params).promise()
  console.log('done')
}

exports.handler = checkAll
