const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, 'The name must be at least 3 characters'],
        required: [true, 'Name is required']
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function(v) {
                return /\d{2,3}-\d{5,}/.test(v)
            },
            message: props => `${props.value} is not in the correct format`
        },
        required: [true, 'Phone number required']
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString() //id was stored as an object in MongoDB
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)