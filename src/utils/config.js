/* Production mode, set false to development mode */
export const productionMode = false
/* MongoDB path and databases */
export const dbPath = 'mongodb://localhost:27017'
export const dbName = productionMode ? 'graphql-server-prd' : 'graphql-server-dev'
export const dbNameTest = 'graphql-server-test'
/* JWT Public Key path and algorithm */
export const publicKeyPath = './src/utils/jwtRS256.key.pub'
export const jwtAlgorithm = 'RS256'
/* Port to run the server: */
export const port = productionMode ? 8010 : 8000
/* Path to GraphQL */
export const graphQLPath = '/gql'
