import '@babel/polyfill'
import _ from 'lodash'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { productionMode, graphQLPath, port } from 'utils/config'
import * as typedefs from 'typedefs'
import * as resolvers from 'resolvers'
import authMiddleware from 'utils/auth'
import errorHandler from 'utils/errorHandler'

const app = express()
app.use(graphQLPath, authMiddleware)
const server = new ApolloServer({
  typeDefs: [ 'type Query {_empty: String} type Mutation {_empty: String}', ...Object.values(typedefs) ],
  resolvers: Object.values(resolvers).reduce((acc, cur) => _.merge(acc, cur)),
  context: ({ req }) => { return { req } },
  formatError: errorHandler,
  debug: !productionMode
})
server.applyMiddleware({ app, path: graphQLPath })

app.listen(port, () => {
  console.log(`Server running in ${(productionMode) ? 'PRODUCTION' : 'DEVELOPMENT'} mode at http://localhost:${port}`)
})
