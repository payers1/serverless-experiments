const P = require('bluebird')
const fs = require('fs')
const _ = require('lodash')
const getDetailsScraper = require('../scrapers/03-fetch-detailed-info')
const Bucket = process.env.BUCKET
const AWS = require('aws-sdk')
const s3 = new AWS.S3()

async function getData() {
  const params = {
    Bucket,
    Key: 'wines-w-inventory.json'
  }
  const { Body } = await s3.getObject(params).promise()
  return JSON.parse(Body.toString())
}

async function saveData(data) {
  const Body = Buffer.from(JSON.stringify(data, null, ' '), 'binary')
  const Key = 'wines-w-details.json'
  const params = {
    Body,
    Key,
    Bucket
  }
  await s3.putObject(params).promise()
  console.log('done')
}

async function run() {
  const data = await getData()
  const dataWithDetails = []
  const batches = _.chunk(data, 25)
  for (let i = 0; i < batches.length; i++) {
    console.log(`BATCH ${i} OF ${batches.length}`)
    const results = await P.map(batches[i], async item => {
      const details = await getDetailsScraper(item.productId)
      _.assign(item, details)
      return item
    }).catch(console.error)
    dataWithDetails.push(...results)
  }
  await saveData(dataWithDetails)
}

exports.handler = run
