const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const docClient = require('../db')
const Bucket = process.env.BUCKET

async function getData() {
  const params = {
    Key: 'wines-w-details.json',
    Bucket
  }
  const { Body } = await s3.getObject(params).promise()
  return JSON.parse(Body.toString())
}

async function saveItems() {
  const data = await getData()

  data.forEach(async item => {
    const params = {
      TableName: 'wine-table-dev',
      Item: {
        title: item.title,
        productCode: item.productCode,
        productId: item.productId,
        tag: item.tag || 'no_tag',
        inventory: item.inventory,
        description: item.description || 'no_description',
        price: item.price,
        country: item.country,
        variety: item.variety,
        vintage: item.vintage,
        img: item.img,
        ratings: item.ratings
      }
    }
    await docClient.put(params).promise()
  })
}

exports.handler = saveItems
