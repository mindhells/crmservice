const mongoose = require('mongoose')

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

module.exports = {
    Customer: mongoose.model('Customer', CustomerSchema)
}