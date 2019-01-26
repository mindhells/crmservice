const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

mongoose.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true }
)

const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    }
})

CustomerSchema.set('toObject', { virtuals: true })

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    hash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
})

UserSchema.set('toObject', { virtuals: true })

// password encrypt/verify
UserSchema.virtual('password').set(function(value) {
    const salt = bcrypt.genSaltSync(10)
    this.hash = bcrypt.hashSync(value, salt)
})

UserSchema.method('verifyPassword', function(plainPassword) {
    return bcrypt.compareSync(plainPassword, this.hash)
})

module.exports = {
    Customer: mongoose.model('Customer', CustomerSchema),
    User: mongoose.model('User', UserSchema)
}