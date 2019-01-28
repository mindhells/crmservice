const prepare = require('mocha-prepare')
const mongoUnit = require('mongo-unit')

// initialize a demo mongo instance for the tests
prepare(done => mongoUnit.start()
 .then(testMongoUrl => {
   process.env.MONGODB_URI = testMongoUrl
   done()
 }))