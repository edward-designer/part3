const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstackopen:${password}@cluster0.qvdigxq.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: 2,
      required: true
    },  
    number: {
      type: String,
      required: true
    }  
})
const Person = mongoose.model('person', personSchema)

if(process.argv[3]&&process.argv[4]){
    mongoose
    .connect(url)
    .then((result) => {
      const person = new Person({
          name: process.argv[3],
          number: process.argv[4],
      })
      return person.save()
    })
    .then(() => {
      console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}else{
    mongoose
    .connect(url)
    .then(() => {
      console.log('phonebook:')
      Person.find({}).then(result => {
          result.forEach(person => {
            console.log(person.name, person.number)
          })
          mongoose.connection.close()
        })
    })
    .catch((err) => console.log(err))
}
