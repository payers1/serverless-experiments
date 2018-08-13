const typeDefs = `
  type Wine {
    productId: Int
    productCode: Int
    title: String
    tag: String
    inventory: Int
    description: String
    price: Float
    country: String
    region: String
    variety: String
    vintage: String
    img: String
    ratings: [String]
    starred: Boolean
    lastEvaluatedKey: String
  }

  type Query {
    wines(
      minprice: Float,
      maxprice: Float,
      limit: Int,
      category_id: String!,
      starting_at: String
    ): [Wine]
  }

  type Mutation {
    updateWine(productId: String!, description: String, starred: Boolean): Wine
  }
`

module.exports = typeDefs
