const express = require('express')
const cors = require('cors')

const { v4: uuidv4 } = require('uuid')

const app = express()

app.use(cors())
app.use(express.json())

const users = []

function checksExistsUserAccount (request, response, next) {
  next()
}

app.post('/users', (request, response) => {
  const { name, username } = request.body

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  if (users.some(user => user.username === username)) {
    return response.status(400).json({ error: 'Username already exists!' })
  }

  users.push(user)

  return response.status(201).json(user)
})

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
})

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body
  const { username } = request.headers // user autentication

  if (!users.some(user => user.username === username)) {
    return response.status(404).json({ error: 'Username dont exists!' })
  }

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  users.find(user => user.username === username).todos.push(todo)

  return response.status(201).json(todo)
})

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
})

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
})

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
})

module.exports = app
