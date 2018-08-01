const AWS = require('aws-sdk')
const { IS_OFFLINE } = process.env
const dbConfig =
  IS_OFFLINE === 'true'
    ? {
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      }
    : undefined

module.exports = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })
