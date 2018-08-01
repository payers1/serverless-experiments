const { ApolloServer } = require('apollo-server-lambda')
const { typeDefs, resolvers } = require('./schema')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    settings: {
      'editor.theme': 'light',
      'editor.cursorShape': 'block'
    }
  }
})

exports.graphqlHandler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true
  }
})
