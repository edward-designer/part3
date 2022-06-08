require('dotenv').config() 

const express = require('express');
const morgan = require('morgan');
const cors = require('cors'); // for CORS
const Person = require('./models/people');

const app = express();

app.use(express.static('build'))
app.use(express.json());
app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
}));
app.use(cors()); 


app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(people => {
        response.json(people)
    }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if(person){
            response.json(person)
        }else{
            response.status(404).end()
        }
      }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body;

    if(!body.name||!body.number){
        return response.status(400).json({
            error: 'Some info is missing'
        })
    }

    const person = new Person ({
        name: body.name,
        number: body.number
     })

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    }).catch(error => next(error))
})


app.post('/api/persons/', (request, response, next) => {
    const body = request.body;

    if(!body.name||!body.number){
        return response.status(400).json({
            error: 'Some info is missing'
        })
    }
    const person = new Person ({
        name: body.name,
        number: body.number
     })

    person.save().then(savedPerson =>{
        response.status(200).json(savedPerson)
    }).catch(error => next(error))

})

app.get('/info', (request, response, next) => {
    const now = new Date().toString();
    Person.find({}).then(people => {
        response.send(`Phonebook has info for ${Object.keys(people).length} people<br/>${now}`)
    }).catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)
  
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
}
  
app.use(errorHandler)



const PORT = process.env.PORT
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))
