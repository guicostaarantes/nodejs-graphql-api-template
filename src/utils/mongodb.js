import { dbPath, dbName } from 'utils/config'
import { MongoClient } from 'mongodb'

const mongodb = (async function createMongoConnection () {
  const client = await MongoClient.connect(dbPath, { useNewUrlParser: true })
  console.log(`Established connection with Mongo server at ${client.s.url} and database ${dbName}`)
  return client.db(dbName)
})()

export default mongodb
