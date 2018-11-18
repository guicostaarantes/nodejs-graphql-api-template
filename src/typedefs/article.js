import { gql } from 'apollo-server-express'

export default gql`

extend type Query {
  findArticle(id: ID): Article
}

extend type Mutation {
  createArticle(title: String!, text: String!, owner: ID!): Article
  updateArticle(id: ID!, title: String, text: String): Article
  deleteArticle(id: ID!): Boolean
}

type Article {
  id: ID
  title: String
  text: String
}

`
