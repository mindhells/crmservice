# CRMService
Synthetic GraphQL API
Libraries and dependencies:
[Apollo Server](https://www.apollographql.com/docs/apollo-server/)
[Mongoose](https://mongoosejs.com/)
[JWT](https://jwt.io/)
[Mocha](https://mochajs)
[Chai](https://www.chaijs.com)

#### Initial setup for developers
Copy the env file sample
```sh
cp .env.example .env
```
Start the docker environment
```sh
docker-compose up
```
this will create the image described in Dockerfile (if not created) and start the nodejs and mongo containers
Once the nodejs is ready you can navigate to http://localhost:4000 to load the apollo server playground

#### Security
You will need to create and admin user the 1st time

We use JWT for creating a token when the user logs in. The client must send this token as the authorization header to identify himself.

#### Tests
To perform the mocha tests just run
```sh
docker-compose exec api bash -c "npm test"
```
Resolver tests are performed against an in-memory mongo server (using mongo-unit package).

#### File uploading
The files are actually stored into the mongo db as binary and returned as base64 encoded string within the customer data

This is a sample apollo-client to try the file upload functionality
```js
const { ApolloClient } = require('apollo-boost')
const gql = require('graphql-tag')
const { InMemoryCache } =  require('apollo-cache-inmemory')
const { onError } =  require('apollo-link-error')
const { ApolloLink } =  require('apollo-link')
const fetch = require('node-fetch')
const { createUploadLink } = require('apollo-upload-client')

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        );
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    createUploadLink({
      uri: 'http://localhost:4000/graphql',
      credentials: 'same-origin',
      fetch: fetch
    })
  ]),
  cache: new InMemoryCache()
});

const photo = new Blob(['text content'], { type: 'text/plain' })
photo.name = 'example.txt'
const name = 'Some'
const surname = 'Guy'

client.mutate({
    mutation: gql`
        mutation($photo: Upload!, $name: String, $surname: String) {
            addCustomer(input: {name: $name, surname: $surname, photo: $photo}) {
                id
            }
        }
    `,
    variables: { photo, name, surname }
})
```