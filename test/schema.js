const { mockServer, makeExecutableSchema } = require('apollo-server')
const { expect } = require('chai')
const fs = require('fs')
const path = require('path')
const typeDefs = fs.readFileSync(path.join(__dirname, '../schema.graphql'), 'utf-8')

const getCustomersCase = {
    id: 'get customers',
    query: `
      query {
        customers {
           name
           surname
        }
      }
    `,
    variables: {},
    expected: { data: { customers: [{ name: 'Some', surname: 'Guy' }, { name: 'Some', surname: 'Guy' }] } }
}

const addCustomerCase = {
    id: 'add customer',
    query: `
      mutation ($input:CustomerInput!) {
        addCustomer (input: $input) {
           name
           surname
        }
      }
    `,
    variables: { input: { name: 'New', surname: 'Guy' } },
    expected: { data: { addCustomer: { name: 'Some', surname: 'Guy' } } }
}

describe('schema', () => {
    const cases = [
        getCustomersCase,
        addCustomerCase
    ]

    const schema = makeExecutableSchema({ typeDefs })

    const server = mockServer(schema, {
        Customer: () => ({
            id: '6786876ab786bf2',
            name: 'Some',
            surname: 'Guy'
        })
    }, false)

    it('has valid type definitions', async () => {
        expect(async () => {
            const MockServer = mockServer(typeDefs)
            await MockServer.query(`{ __schema { types { name } } }`)
        }).to.not.throw()
    })

    cases.forEach(obj => {
        const { id, query, variables, expected } = obj
        it(`query: ${id}`, async () => {
            const result = await server.query(query, variables)
            expect(result).deep.equal(expected)
        })
    })

})