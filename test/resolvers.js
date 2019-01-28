const { expect } = require('chai')
const resolvers = require('../resolvers')

describe('resolvers', () => {

    const userInput = {
        email: 'admin@theam.com',
        password: 'hardpassword',
        role: 'ADMIN'
    }
    let user = null

    it('creates a user', async () => {
        user = await resolvers.Mutation.addUser(null, { input: userInput })
        const { email, role } = userInput
        expect(user).to.include({ email, role })
    })

    it('gets the user created', async () => {
        const result = await resolvers.Query.user(null, { id: user._id })
        expect(result).deep.equal(user)
    })

    it('the user can log in', async () => {
        const { email, password } = userInput
        expect(async () => {
            await resolvers.Query.login(null, { email, password })
        }).to.not.throw()
    })

})



