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
  }

  type Query {
    wines(minprice: Float, maxprice: Float, tag: String): [Wine]
  }

  type Mutation {
    updateWine(productId: String!, description: String): Wine
  }
`

module.exports = typeDefs
