import _ from 'lodash'
import { ObjectId } from 'mongodb'
import mongodb from 'utils/mongodb'

export default {
  Query: {
    findArticle: async (parent, args, { req }) => {
      const db = await mongodb
      const article = await db.collection('articles').findOne({ _id: ObjectId(args.id) })
      return article
    }
  },
  Mutation: {
    createArticle: async (parent, args, { req }) => {
      const db = await mongodb
      const article = await db.collection('articles').insertOne(args)
      return { ...article.ops[0], id: article.ops[0]._id.toString() }
    },
    updateArticle: async (parent, args, { req }) => {
      const db = await mongodb
      const article = await db.collection('articles').findOneAndUpdate({ _id: ObjectId(args.id) }, { $set: _.omit(args, ['id']) })
      return article
    },
    deleteArticle: async (parent, args, { req }) => {
      const db = await mongodb
      const article = await db.collection('articles').findOneAndDelete({ _id: ObjectId(args.id) })
      return article
    }
  }
}
