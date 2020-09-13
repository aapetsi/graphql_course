import { GraphQLServer } from 'graphql-yoga'

// Scalar types - String, Boolean, Int, Float, ID,

// Type definitions (schema)
const typeDefs = `
  type Query {
    greeting(name: String, position: String): String!
    add(a: Float!, b: Float!): Float!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`

// Resolvers
const resolvers = {
  Query: {
    greeting(parent, args, ctx, info) {
      return args.name && args.position
        ? `Hello, ${args.name}! You are my favorite ${args.position}`
        : 'Hello!'
    },
    add(parent, args, ctx, info) {
      return args.a + args.b
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
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
})

server.start(() => {
  console.log('Server is running')
})
