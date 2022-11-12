/* eslint-disable spaced-comment */
require('dotenv').config()
const express = require('express')
const cors = require('cors') // importante para conectar nuestro front al backemd
const morgan = require('morgan')
const conexionBD = require('./mongo')
const usersR = require('./router/usersApi')
const notesR = require('./router/notesApi')
const loginR = require('./router/loginApi')
const app = express()

//configuracines inicio
app.set('nombre', 'SERVER DE WILL')
app.use(express.json())
app.use(cors()) // usamos el cors
// visualizamos nuestro front como archivos staticos
app.use(express.static('../app/dist'))

// llamamos al mongo
conexionBD()

// middleware incios
app.use(morgan('dev')) // ocultar en test

// rutas
// app.get('/', (req, res) => {
//   res.send('hola')
// })
app.use('/api/users', usersR)
app.use('/api/notes', notesR)
app.use('/api/login', loginR)

// midleware end
// si se escribe mal las rutas devolver un 404 not found
app.use((req, res) => {
  res.status(404).end()
})

// listen
const port = process.env.PORT || 3001
const server = app.listen(port)
console.log(`${app.get('nombre')} on port ${port}`)

module.exports = { app, server }
