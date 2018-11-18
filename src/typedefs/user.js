import { gql } from 'apollo-server-express'

export default gql`

extend type Query {
  findUser(id: ID!): User
}

extend type Mutation {
  createUser(email: String!, username: String!): User
  updateUser(newEmail: String, newUsername: String): User
  activateUser(active: Boolean): User
}

type User {
  id: ID
  username: String
  email: String
  active: Boolean
}

`
