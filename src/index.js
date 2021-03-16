const express = require('express')
const cors = require('cors')

const { v4: uuidv4 } = require('uuid')

const app = express()

app.use(cors())
app.use(express.json())

const users = []

function checksExistsUserAccount (request, response, next) {
  const { username } = request.headers

  if (!users.some(user => user.username === username)) {
    return response.status(404).json({ error: 'User dont exists!' })
  }

  const user = users.find(user => user.username === username)

  request.user = user

  return next()
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
  const { user } = request

  return response.json(user.todos)
})

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body
  const { user } = request

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo)

  return response.status(201).json(todo)
})

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params
  const { title, deadline } = request.body
  const { user } = request

  if (!user.todos.some(todo => todo.id === id)) {
    return response.status(404).json({ error: 'Unable to update todo!' })
  }

  const todo = user.todos.find(todo => todo.id === id)

  todo.title = title
  todo.deadline = new Date(deadline)

  return response.json(todo)
})

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { id } = request.params
  const { done } = request.query
  const { user } = request

  const todo = user.todos.find(todo => todo.id === id)

  todo.done = done !== 'false'

  return response.json(todo)
})

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
})

module.exports = app
