import mongodb from 'utils/mongodb'
import { ObjectId } from 'mongodb'
import { ApolloError } from 'apollo-server-express'

export default {
  Query: {
    findUser: async (parent, args, { req }) => {
      const db = await mongodb
      const user = await db.collection('users').findOne({ _id: ObjectId(args.id) })
      if (!user || !user.active) return null
      console.log()
      return { ...user, id: user._id.toString() }
    }
  },
  Mutation: {
    createUser: async (parent, args, { req }) => {
      const db = await mongodb
      const usernameAlreadyExists = await db.collection('users').findOne({ username: args.username })
      const emailAlreadyExists = await db.collection('users').findOne({ email: args.email })
      if (usernameAlreadyExists) return new ApolloError('Existing register for unique field "username".', 'RESOURCE_NOT_UNIQUE')
      else if (emailAlreadyExists) return new ApolloError('Existing register for unique field "email".', 'RESOURCE_NOT_UNIQUE')
      else {
        const user = await db.collection('users').insertOne({ ...args, active: true })
        return { ...user.ops[0], id: user.ops[0]._id.toString() }
      }
    },
    updateUser: async (parent, args, { req }) => {
      const db = await mongodb
      let set = {}
      let usernameAlreadyExists = false
      let emailAlreadyExists = false
      if (args.newUsername) {
        usernameAlreadyExists = await db.collection('users').findOne({ username: args.newUsername })
        set.username = args.newUsername
      }
      if (args.newEmail) {
        emailAlreadyExists = await db.collection('users').findOne({ email: args.newEmail })
        set.email = args.newEmail
      }
      if (usernameAlreadyExists) return new ApolloError('Existing register for unique field "username".', 'RESOURCE_NOT_UNIQUE')
      else if (emailAlreadyExists) return new ApolloError('Existing register for unique field "email".', 'RESOURCE_NOT_UNIQUE')
      else {
        const user = await db.collection('users').findOneAndUpdate({ _id: ObjectId(req.auth.sub) }, { $set: set })
        console.log()
        return { ...user.value, ...set, id: user.value._id.toString() }
      }
    },
    activateUser: async (parent, args, { req }) => {
      const db = await mongodb
      const user = await db.collection('users').findOneAndUpdate({ _id: ObjectId(req.auth.sub) }, { $set: { active: args.active } })
      return { ...user.value, active: args.active, id: user.value._id.toString() }
    }
  }
}
