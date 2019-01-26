const { Customer, User } = require('./model')

module.exports = {
    Query: {
        async customer(_, { id }) {
            const customer = await Customer.findById(id)
            return customer ? customer.toObject() : null
        },
        async customers() {
            const customers = await Customer.find()
            return customers.map(customer => customer.toObject())
        },
        async user(_, { id }) {
            const user = await User.findById(id)
            return user ? user.toObject() : null
        },
        async users() {
            const users = await User.find()
            return users.map(user => user.toObject())
        }
    },
    Mutation: {
        async addCustomer(_, { input }) {
            const customer = await Customer.create(input)
            return customer.toObject()
        },
        async editCustomer(_, { id, input }) {
            const customer = await Customer.findByIdAndUpdate(id, input,  { new: true })
            return customer ? customer.toObject() : null 
        },
        async deleteCustomer(_, { id }) {
            const customer = await Customer.findByIdAndDelete(id)
            return customer ? customer.toObject() : null 
        },
        async addUser(_, { input }) {
            const user = await User.create(input) 
            return user.toObject()
        },
        async editUser(_, { id, input }) {
            const user = await User.findById(id)
            if (user) {
                user.set(input)
                await user.save()
            }
            return user
        },
        async deleteUser(_, { id }) {
            const user = await User.findByIdAndDelete(id)
            return user ? user.toObject() : null
        }
    }
}