const { WINE_TABLE } = process.env
const { db: docClient } = require('../db')
const _ = require('lodash')
const TableName = WINE_TABLE || 'wine-table-dev'

async function getItemByProductId(productId) {
  const params = {
    TableName,
    Key: { productId }
  }
  const { Item } = await docClient.get(params).promise()
  return Item
}

function getTagQueryParams(params, tag) {
  return _.merge(params, {
    IndexName: 'tagIndex',
    KeyConditionExpression: 'tag = :tag',
    ExpressionAttributeValues: { ':tag': tag }
  })
}

function getCategoryQueryParams(params, category) {
  return _.merge(params, {
    IndexName: 'categoryIndex',
    KeyConditionExpression: 'category_id = :category',
    ExpressionAttributeValues: { ':category': category }
  })
}

function getParams(args) {
  let defaultParams = {
    TableName,
    ExpressionAttributeValues: {
      ':minprice': args.minprice || 0.0,
      ':maxprice': args.maxprice || 1000.0
    },
    FilterExpression: 'price between :minprice and :maxprice'
  }
  switch (args.category_id) {
    case 'chairmans':
      return getTagQueryParams(defaultParams, 'Chairmans Selection')
    case 'top_rated':
      return getTagQueryParams(defaultParams, 'Top Rated')
    case 'starred':
      return _.merge(defaultParams, {
        FilterExpression: `price between :minprice and :maxprice and starred = :starred`,
        ExpressionAttributeValues: { ':starred': true }
      })
    case 'red':
      return getCategoryQueryParams(defaultParams, '1333936')
    case 'sparkling':
      return getCategoryQueryParams(defaultParams, '1333982')
    case 'rose':
      return getCategoryQueryParams(defaultParams, '1333977')
    default:
      return defaultParams
  }
}

const resolvers = {
  Query: {
    wines: async (root, args, context, info) => {
      const params = getParams(args)
      const results = ['starred', 'all'].includes(args.category_id)
        ? await docClient.scan(params).promise()
        : await docClient.query(params).promise()
      const { Items } = results
      return Items
    }
  },
  Mutation: {
    updateWine: async (root, args, context, info) => {
      const Item = await getItemByProductId(args.productId)
      const updateParams = _.omit(args, 'productId')
      const productId = args.productId
      const params = {
        TableName,
        Key: { productId },
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
