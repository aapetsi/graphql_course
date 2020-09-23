import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'
import db from './db'

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, { db }, info) {
      if (!args.query) {
        return db.users
      }

      let filteredUsers = db.users.filter((user) =>
        user.name.toLowerCase().includes(args.query.toLowerCase())
      )

      return filteredUsers
    },
    posts(parent, args, { db }, info) {
      if (!args.query) {
        return db.posts
      }

      let filteredPosts = db.posts.filter(
        (post) =>
          post.title.toLowerCase().includes(args.query.toLowerCase()) ||
          post.body.toLowerCase().includes(args.query.toLowerCase())
      )

      return filteredPosts
    },
    comments(parent, args, { db }, info) {
      return db.comments
    },
    me() {
      return {
        id: '123098',
        name: 'Mike',
        email: 'mike@example.com',
        age: 28,
      }
    },
    post() {
      return {
        id: 'abc123',
        title: 'How to build an app',
        body: 'lorem ipsum dolor ist amet dolr sit amet ipsum ignus',
        published: true,
      }
    },
  },
  Mutation: {
    createUser(parent, args, { db }, info) {
      const emailTaken = db.users.some((user) => user.email === args.data.email)
      if (emailTaken) {
        throw new Error('Email taken')
      }
      const user = {
        id: uuidv4(),
        ...args.data,
      }

      db.user.push(user)

      return user
    },
    deleteUser(parent, args, { db }, info) {
      const userIndex = db.users.findIndex((user) => user.id === args.id)

      if (userIndex === -1) {
        throw new Error('User not found')
      }

      const deletedUsers = db.users.splice(userIndex, 1)

      posts = db.posts.filter((post) => {
        const match = post.author === args.id
        if (match) {
          comments = db.comments.filter((comment) => comment.post !== post.id)
        }
        return !match
      })

      comments = db.comments.filter((comment) => comments.author !== args.id)

      return deletedUsers[0]
    },
    createPost(parent, args, { db }, info) {
      const userExists = db.users.some((user) => user.id === args.data.author)
      if (!userExists) {
        throw new Error('User not found')
      }

      const post = {
        id: uuidv4(),
        ...args.data,
      }

      db.posts.push(post)

      return post
    },
    deletePost(parent, args, { db }, info) {
      const postIndex = db.posts.findIndex((post) => post.id === args.id)

      if (postIndex === -1) {
        throw new Error('Post not found')
      }

      const deletedPosts = db.posts.splice(postIndex, 1)

      comments = db.comments.filter((comment) => comment.post !== args.id)

      return deletedPosts[0]
    },
    createComment(parent, args, { db }, info) {
      const userExists = db.users.some((user) => user.id === args.data.author)
      const postExists = db.posts.some(
        (post) => post.id === args.data.post && post.published
      )

      if (!userExists || !postExists)
        throw new Error('Unable to find user and post')

      const comment = {
        id: uuidv4(),
        ...args.data,
      }

      db.comments.push(comment)

      return comment
    },
    deleteComment(parent, args, { db }, info) {
      const commentIndex = db.comments.findIndex(
        (comment) => comment.id === args.id
      )

      if (commentIndex === -1) {
        throw new Error('Comment not found')
      }

      const deletedComments = db.comments.splice(commentIndex, 1)

      return deletedComments[0]
    },
  },

  Post: {
    author(parent, args, { db }, info) {
      return db.users.find((user) => {
        return user.id === parent.author
      })
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter((comment) => comment.post === parent.id)
    },
  },
  User: {
    posts(parent, args, { db }, info) {
      return db.posts.filter((post) => post.author === parent.id)
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter((comment) => comment.author === parent.id)
    },
  },
  Comment: {
    author(parent, args, { db }, info) {
      return db.users.find((user) => {
        return user.id === parent.author
      })
    },
    post(parent, args, { db }, info) {
      return db.posts.find((post) => post.id === parent.post)
    },
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    db,
  },
})

server.start(() => {
  console.log('Server is running')
})
