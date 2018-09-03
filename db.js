const TableName = 'wine-table-dev'
const AWS = require('aws-sdk')
const { IS_OFFLINE } = process.env
const dbConfig =
  IS_OFFLINE === 'true'
    ? {
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      }
    : undefined
const db = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })

async function countAll() {
  const params = {
    TableName,
    Select: 'COUNT'
  }
  const { Count } = await db.scan(params).promise()
  return Count
}

async function getAll() {
  const params = { TableName }
  const { Items } = await db.scan(params).promise()
  return { Items }
}

async function countChairmanSelection() {
  return countTags('Chairmans Selection')
}

async function countTopRated() {
  return countTags('Top Rated')
}

function countRed() {
  return countCategory('1333936')
}

function countRose() {
  return countCategory('1333977')
}

function countSparkling() {
  return countCategory('1333982')
}

async function countCategory(categoryId) {
  const params = {
    TableName,
    IndexName: 'categoryIndex',
    KeyConditionExpression: 'category_id = :category',
    ExpressionAttributeValues: {
      ':category': categoryId
    },
    Select: 'COUNT'
  }
  const { Count } = await db.query(params).promise()
  return Count
}

async function countTags(tag) {
  const params = {
    TableName,
    FilterExpression: 'tag = :tag',
    ExpressionAttributeValues: {
      ':tag': tag
    },
    Select: 'COUNT'
  }
  const { Count } = await db.scan(params).promise()
  return Count
}

async function countStarred() {
  const params = {
    TableName,
    FilterExpression: 'starred = :starred',
    ExpressionAttributeValues: {
      ':starred': true
    },
    Select: 'COUNT'
  }
  const { Count } = await db.scan(params).promise()
  return Count
}

module.exports = {
  db,
  countAll,
  getAll,
  countChairmanSelection,
  countTopRated,
  countRed,
  countSparkling,
  countRose
}
