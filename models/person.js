const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const database = process.env.MONGODB_URI

console.log('connecting to', database)

mongoose.connect(database)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB', error.message)
  })

const numberValidator = (val) => {
  return /(^\d{2,3}-)\d+$/gm.test(val)
}

const numberError = [ numberValidator, 'malformatted phone number' ]

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    validate: numberError,
    required: [true, 'Phone number required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
