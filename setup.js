const { User } = require('./model')

var [email, password] = process.argv.slice(2, 4)

User.create({
    email,
    password,
    role: 'ADMIN'
}).then(result => {
    console.log('user created: ', result)
    process.exit(0)
}, error => {
    console.log('error creating the user: ', error)
    process.exit(1)
})


