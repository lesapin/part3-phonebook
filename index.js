const express = require('express')
const app = express()

app.use(express.json())

const PORT = 3001

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
    response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = phonebook.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    phonebook = phonebook.filter(person => person.id !== id)
    response.status(204).end()
})

const generateId = () => String(
    phonebook.length > 0
        ? Math.max(...phonebook.map(person => Number(person.id))) + 1
        : 0
)

app.post('/api/persons/', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'name or number is missing' })
    } else if (phonebook.find(person => person.name.toLowerCase() === body.name.toLowerCase())) {
        return response.status(400).json({ error: 'name must be unique' })
    }

    const entry = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    phonebook = phonebook.concat(entry)

    response.json(entry)
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
