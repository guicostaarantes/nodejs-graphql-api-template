import _ from 'lodash'
import { ObjectId } from 'mongodb'
import mongodb from 'utils/mongodb'
import { ApolloError } from 'apollo-server-express'

export default {
  Query: {
    findArticle: async (parent, args, { req }) => {
      const db = await mongodb
      const article = await db.collection('articles').findOne({ _id: ObjectId(args.id) })
      return { ...article, id: article._id.toString() }
    }
  },
  Mutation: {
    createArticle: async (parent, args, { req }) => {
      const db = await mongodb
      const article = await db.collection('articles').insertOne({ ...args, owner: ObjectId(req.auth.sub) })
      return { ...article.ops[0], id: article.ops[0]._id.toString() }
    },
    updateArticle: async (parent, args, { req }) => {
      const db = await mongodb
      let set = {}
      if (args.newTitle) set.title = args.newTitle
      if (args.newText) set.title = args.newText
      const articleCheckOwner = await db.collection('articles').findOne({ _id: ObjectId(args.id) })
      if (req.auth && articleCheckOwner.owner === req.auth.sub) {
        const article = await db.collection('articles').findOneAndUpdate({ _id: ObjectId(args.id) }, { $set: set })
        return { ...article.value, ...set, id: article.value._id.toString() }
      } else {
        return new ApolloError('Permission denied', 'PERMISSION_DENIED')
      }
    },
    deleteArticle: async (parent, args, { req }) => {
      const db = await mongodb
      const articleCheckOwner = await db.collection('articles').findOne({ _id: ObjectId(args.id) })
      if (req.auth && articleCheckOwner.owner === req.auth.sub) {
        const article = await db.collection('articles').findOneAndDelete({ _id: ObjectId(args.id) })
        return !!article.ok
      } else {
        return new ApolloError('Permission denied', 'PERMISSION_DENIED')
      }
    }
  }
}
