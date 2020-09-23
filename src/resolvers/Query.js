const Query = {
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
}

export { Query as default }
