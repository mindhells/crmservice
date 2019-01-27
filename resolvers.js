const { Customer, User, File } = require('./model')
const jwt = require('jsonwebtoken')

const uploadFile = async (upload) => {
    const { createReadStream, filename, mimetype } = await upload
    const stream = createReadStream()
    const chuncks = []
    await new Promise ((resolve, reject) => {
        stream.on('data', chunk => chuncks.push(chunk))
        stream.on('end', resolve)
        stream.on('error', reject)
    })
    const data = Buffer.concat(chuncks)
    return await File.create({ data, filename, mimetype })       
}

module.exports = {
    Query: {
        async customer(_, { id }) {
            const customer = await Customer.findById(id)
            .populate('createdBy').populate('updatedBy').populate('photo')
            return customer ? customer.toObject() : null
        },
        async customers() {
            const customers = await Customer.find()
            .populate('createdBy').populate('updatedBy').populate('photo')
            return customers.map(customer => customer.toObject())
        },
        async user(_, { id }) {
            const user = await User.findById(id)
            return user ? user.toObject() : null
        },
        async users() {
            const users = await User.find()
            return users.map(user => user.toObject())
        },
        async login(_, { email, password }) {
            const user = await User.findOne({ email })
            if (user && user.verifyPassword(password)) {
                return jwt.sign({ user: user.id }, process.env.JWT_SECRET)
            }
            throw Error('Login failed')
        }
    },
    Mutation: {
        async addCustomer(_, { input }, context) {         
            if (input.photo) {
                input.photo = await uploadFile(input.photo)
            }
            const customer = await Customer.create({
                createdBy: context.user,
                updatedBy: context.user,
                ...input
            })
            return customer.toObject()
        },
        async editCustomer(_, { id, input }, context) {
            if (input.photo) {
                input.photo = await uploadFile(input.photo)
            }
            const customer = await Customer
            .findByIdAndUpdate(id, {  updatedBy: context.user, ...input },  { new: true })
            .populate('createdBy').populate('updatedBy')
            return customer ? customer.toObject() : null 
        },
        async deleteCustomer(_, { id }) {
            const customer = await Customer.findOneAndRemove({ _id: id })
            .populate('createdBy').populate('updatedBy')
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
        async deleteUser(_, { id }, context) {
            if (context.user.id === id) throw Error(`You can't delete yourself`)
            const user = await User.findByIdAndDelete(id)
            return user ? user.toObject() : null
        }
    }
}