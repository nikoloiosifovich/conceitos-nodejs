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

function checksExistsUserTodo (request, response, next) {
  const { user } = request
  const { id } = request.params

  if (!user.todos.some(todo => todo.id === id)) {
    return response.status(404).json({ error: 'Todo dont exists!' })
  }

  const todo = {
    todo: user.todos.find(todo => todo.id === id),
    todoIndex: user.todos.findIndex(todo => todo.id === id)
  }

  request.data = todo

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

app.put('/todos/:id', checksExistsUserAccount, checksExistsUserTodo, (request, response) => {
  const { title, deadline } = request.body
  const { todo } = request.data

  todo.title = title
  todo.deadline = new Date(deadline)

  return response.json(todo)
})

app.patch('/todos/:id/done', checksExistsUserAccount, checksExistsUserTodo, (request, response) => {
  const { done } = request.query
  const { todo } = request.data

  todo.done = done !== 'false'

  return response.json(todo)
})

app.delete('/todos/:id', checksExistsUserAccount, checksExistsUserTodo, (request, response) => {
  const { user } = request
  const { todoIndex } = request.data

  user.todos.splice(todoIndex, 1)

  return response.status(204).send()
})

module.exports = app
