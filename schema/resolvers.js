const { WINE_TABLE } = process.env
const docClient = require('../db')
const _ = require('lodash')

async function getItemByProductId(productId) {
  const params = {
    TableName: 'wine-table-dev',
    Key: {
      productId
    }
  }
  const { Item } = await docClient.get(params).promise()
  return Item
}

const resolvers = {
  Query: {
    wines: async (root, args, context, info) => {
      const filterExpression = args.tag
        ? 'price between :minprice and :maxprice and tag = :tag'
        : 'price between :minprice and :maxprice'
      const tagArgs = args.tag ? { ':tag': args.tag } : {}
      const params = {
        TableName: WINE_TABLE || 'wine-table-dev',
        FilterExpression: filterExpression,
        ExpressionAttributeValues: {
          ':minprice': args.minprice || 0.0,
          ':maxprice': args.maxprice || 100.0,
          ...tagArgs
        }
      }
      const { Items } = await docClient.scan(params).promise()
      return _.sortBy(Items, ['price'])
    }
  },
  Mutation: {
    updateWine: async (root, args, context, info) => {
      const Item = await getItemByProductId(args.productId)
      const updateParams = _.omit(args, 'productId')
      const params = {
        TableName: 'wine-table-dev',
        Key: {
          productId: args.productId
        },
        AttributeUpdates: {
          description: {
            Action: 'PUT',
            Value: updateParams.description
          }
        },
        ReturnValues: 'ALL_NEW'
      }
      const { Attributes } = await docClient.update(params).promise()
      return Attributes
    }
  }
}

module.exports = resolvers
