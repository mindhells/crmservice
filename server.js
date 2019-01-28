const { ApolloServer, makeExecutableSchema, ApolloError } = require('apollo-server')
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')

const RequireAuthDirective = require('./auth.directive.class')
const { User } = require('./model')
const resolvers = require('./resolvers')
const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8')
const schema = makeExecutableSchema({
    resolvers,
    typeDefs,
    schemaDirectives: {
        requireAuth: RequireAuthDirective
    }
})

const server = new ApolloServer({
    schema,
    formatError(error) {
        console.log(error)
        // return new ApolloError('Internal server error', 500)
        delete error.extensions.exception
        return error
    },
    async context({ req }) {
        const token = req && req.headers && req.headers.authorization
        if (token) {
            const data = jwt.verify(token, process.env.JWT_SECRET)
            const user = data.user ? await User.findById(data.user) : null
            return { user }
        }
    }
})

server.listen().then(({url}) => {
    console.log(`server ready at ${url}`)
})