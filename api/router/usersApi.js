// requerimos express.Router() y guardamos en router
const usersR = require('express').Router()
const User = require('../models/usersModel')
const bcrypt = require('bcrypt')
const errorUsers = require('../midlewares/errorUsers')

// FINALIZO TESTING - HORA DE REAFACTORIZAR
// testeando y manejando errores
usersR.get('/', async (req, res) => {
  try {
    // async, va junto con await ponerlos siempre cuando espera una promesa o una peticion
    const data = await User.find({}).populate('notes', { title: 1 })
    res.status(200).json(data)
  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
})
// testeando y manejando errores
usersR.post('/', async (req, res, next) => {
  try {
    const { name, username, password } = req.body
    // hasheando
    const passwordHash = await bcrypt.hash(password, 10)
    // console.log(passwordHash);
    const newUser = new User({ name, username, passwordHash })
    const data = await newUser.save()
    res.status(201).json(data)
  } catch (err) {
    console.log('WWWWWWWWWWWWWWWWWWWWWWWWWW')
    console.log(err.name)
    next(err) // error 400 error del cliente relleno mal los campos o falta por completar
  }
})
usersR.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const { name, username, password } = req.body
    if (req.body.name) {
      /// /actualizando el nombre
      const newName = { name }
      // la verdadera forma de actualizar un campo de nuestro usuario
      const data = await User.updateOne({ _id: id }, newName)
      return res.status(200).json(data)
    } else if (req.body.username) {
      // actualizando el usernmae
      const newUsername = { username }
      const data1 = await User.updateOne({ _id: id }, newUsername)
      return res.status(200).json(data1)
    } else if (req.body.password) {
      // encriptacion de contraseña
      const passwordHash = await bcrypt.hash(password, 10)
      // comparando el password del req.body con el passwordHasheado
      const comparePassword = await bcrypt.compare(password, passwordHash)
      console.log(comparePassword)

      const newPassword = { passwordHash }
      const data2 = await User.updateOne({ _id: id }, newPassword)
      return res.status(200).json(data2)
    } else {
      res.status(401).json({ error: 'el req.body FALLA' })
    }
  } catch (err) {
    console.log(err)
    next(err)
  }
})
usersR.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const data = await User.deleteOne({ _id: id })
    res.status(200).json(data)
  } catch (err) {
    console.log(err)
    next(err)
  }
})

// midleware
// TESTEADO
usersR.use(errorUsers)

module.exports = usersR
