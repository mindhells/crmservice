const { ApolloServer, makeExecutableSchema } = require('apollo-server')
const fs = require('fs')
const path = require('path')

const resolvers = require('./resolvers')
const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8')
const schema = makeExecutableSchema({
    resolvers,
    typeDefs
})

const server = new ApolloServer({ schema })

server.listen().then(({url}) => {
    console.log(`server ready at ${url}`)
})