const getInStoreWineScraper = require('../scrapers/01-get-all-wine')
const AWS = require('aws-sdk')
const s3 = new AWS.S3()

async function getAllInStoreWines() {
  const data = await getInStoreWineScraper()
  const Body = Buffer.from(JSON.stringify(data, null, ' '), 'binary')
  const Bucket = process.env.BUCKET
  const Key = 'wines.json'

  const params = {
    Body,
    Key,
    Bucket
  }
  await s3.putObject(params).promise()
}

exports.handler = getAllInStoreWines
