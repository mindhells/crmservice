const { Customer } = require('./model')

module.exports = {
    Query: {
        async customer(_, { id }) {
            const customer = await Customer.findById(id)
            return customer ? customer.toObject() : null
        },
        async customers() {
            const customers = await Customer.find()
            return customers.map(customer => customer.toObject())
        }
    },
    Mutation: {
        async addCustomer(_, { input }) {
            const customer = await Customer.create(input)
            return customer.toObject()
        },
        async editCustomer(_, { id, input }) {
            const customer = await Customer.findByIdAndUpdate(id, input)
            return customer ? customer.toObject() : null 
        },
        async deleteCustomer(_, { id }) {
            const customer = await Customer.findByIdAndDelete(id)
            return customer ? customer.toObject() : null 
        }
    }
}