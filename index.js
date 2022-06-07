const express = require('express');
const morgan = require('morgan');

const app = express();
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

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person=>person.id===id)
    if(person){ response.json(person) }
    else { response.status(404).end() }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person=>person.id!==id)
    response.status(204).end()
})

const getNewId = () => {
   //let max = Math.max(0,...persons.map(person => person.id));
   //return max+1;
   return Math.floor(Math.random()*100000)
}

app.post('/api/persons/', (request, response) => {
    const body = request.body;

    if(!body.name||!body.number){
        response.status(400).json({
            error: 'Some info is missing'
        })
    }else if(persons.find(person=>person.name===body.name)){
        response.status(400).json({
            error: 'Name must be unique'
        })
    }else{
        const person = {
            id: getNewId(),
            name: body.name,
            number: body.number
        }

        persons = persons.concat(person)
        response.status(200).json(person)
    }
})

const getPersonsCount = () => {
    const now = new Date().toString();
    return (`Phonebook has info for ${persons.length} people<br/>${now}`);  
}

app.get('/info', (request, response) => {
    response.send(getPersonsCount())
})

// return 404 for other undefined routes
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)


const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)