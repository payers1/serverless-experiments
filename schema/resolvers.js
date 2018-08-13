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
      let FilterExpression = 'price between :minprice and :maxprice'
      const ExpressionAttributeValues = {
        ':minprice': args.minprice || 0.0,
        ':maxprice': args.maxprice || 1000.0
      }
      const categoryId = args.category_id
      switch (categoryId) {
        case 'all':
          break
        case 'chairmans':
          FilterExpression = `${FilterExpression} and tag = :tag`
          ExpressionAttributeValues[':tag'] = 'Chairmans Selection'
          break
        case 'top_rated':
          FilterExpression = `${FilterExpression} and tag = :tag`
          ExpressionAttributeValues[':tag'] = 'Top Rated'
          break
        case 'starred':
          FilterExpression = `${FilterExpression} and starred = :starred`
          ExpressionAttributeValues[':starred'] = true
          break
        case 'red':
          FilterExpression = `${FilterExpression} and category_id = :category`
          ExpressionAttributeValues[':category'] = '1333936'
          break
        case 'sparkling':
          FilterExpression = `${FilterExpression} and category_id = :category`
          ExpressionAttributeValues[':category'] = '1333982'
          break
        case 'rose':
          FilterExpression = `${FilterExpression} and category_id = :category`
          ExpressionAttributeValues[':category'] = '1333977'
          break
        default:
      }
      const params = {
        TableName: WINE_TABLE || 'wine-table-dev',
        FilterExpression,
        ExpressionAttributeValues
      }
      if (args.starting_at) {
        params.ExclusiveStartKey = {
          productId: args.starting_at
        }
      }
      if (args.limit) {
        params.Limit = args.limit
      }
      const results = await docClient.scan(params).promise()
      const { Items } = results
      const sorted = _.sortBy(Items, ['price']).map(item => {
        item.lastEvaluatedKey = _.get(results, 'LastEvaluatedKey.productId')
        return item
      })
      return sorted
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
          },
          starred: {
            Action: 'PUT',
            Value: updateParams.starred
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
