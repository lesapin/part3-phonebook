require('dotenv').config()

const cors = require('cors')

const morgan = require('morgan')

// custom token to extract request body into a string
morgan.token('body', function (req, res) { 
    return JSON.stringify(req.body)
})

const express = require('express')
const app = express()

// tokens used by tiny preset + the json request body
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

const Person = require('./models/person')

let phonebook = 
    [
        {
            "id": "1",
            "name": "Arto Hellas",
            "number": "040-123456"
        },
        {
            "id": "2",
            "name": "Ada Lovelace",
            "number": "39-44-5323523"
        },
        {
            "id": "3",
            "name": "Dan Abramov",
            "number": "12-43-234345"
        },
        {
            "id": "4",
            "name": "Mary Poppendick",
            "number": "39-23-6423122"
        }
    ]

app.get('/', (request, response) => {
    response.send('<h1>Hello, world!</h1>')
})

app.get('/info', (request, response) => {
    const entries = phonebook.length
    const date = new Date(Date.now())

    response.send(`
        <p>Phonebook has info for ${entries} people</p>
        <p>${date.toString()}</p>
    `)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.json(person)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    phonebook = phonebook.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'name or number is missing' })
    } else if (phonebook.find(person => person.name.toLowerCase() === body.name.toLowerCase())) {
        return response.status(400).json({ error: 'name must be unique' })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(saved => {
        response.json(saved)
    })
})

const unknownEndpoint = (req, res) =>
    res.status(404).send({ error: 'unknown endpoint' })

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
