require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

// custom token to extract request body into a string
morgan.token('body', function (req, res) { 
    return JSON.stringify(req.body)
})

// tokens used by tiny preset + the json request body
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
    response.send('<h1>Hello, world!</h1>')
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        const entries = persons.length
        const date = new Date(Date.now())
    
        response.send(`
            <p>Phonebook has info for ${entries} people</p>
            <p>${date.toString()}</p>
        `)
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons/', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'name or number is missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(saved => {
        response.json(saved)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })  
        .catch(error => next(error))
})

const unknownEndpoint = (req, res) => res.status(404).send({ error: 'unknown endpoint' })
app.use(unknownEndpoint)

// error handler middleware
const errorHandler = (err, req, res, next) => {
    console.log(err.message)

    if (err.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }

    next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
