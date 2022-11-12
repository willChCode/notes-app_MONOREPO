// NOTA: no olvides va en escala
const notesR = require('express').Router()
const jwt = require('jsonwebtoken') // importamos aquipara que lea el token
const Note = require('../models/notesModel')
const User = require('../models/usersModel')
const errorNotes = require('../midlewares/errorNotes')

// YA TESTEADO - TOCa REFACTORIZAR
notesR.get('/', async (req, res) => {
  try {
    const notas = await Note.find({}).populate('users', { name: 1 })
    res.status(200).json(notas)
  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
})
// pondremos el token y verificamos si tiene o no para que pueda crear la nota
notesR.post('/', async (req, res, next) => {
  const { title, content, important } = req.body // req.body
  // recueramos el token por medio de la cabezera
  const authorization = req.get('authorization') // enviamos la cabecera
  console.log('_________AUTHORIZATION___________')
  console.log(authorization)

  // toLowerCase devuelve todo en minuscula y el startsWith inidica si una cadena de texto comienza con los
  // caracteres de una cadena ce texto concreta
  let token = null
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  }
  console.log(token)
  let decodedToken = {}
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    return next(err)
  }
  console.log('______________')
  console.log(decodedToken) // nos muestra el toquen ya desencriptado y verificado
  const { id: userId } = decodedToken
  console.log(userId)

  if (!token || !decodedToken.id) {
    return res
      .status(401)
      .json({ error: 'NO TIENES ACCESO o el token es invalido' })
  }

  // recuperamos la informacion del usuario por id y lo gardamos en una constante pa mandarle a las notas
  // todo este proces me recupera {datosUser}
  // la request, es con userId, una vez recuperado le mandamos el id del usuario antes de guardar la nota
  const user = await User.findById(userId) // console.log(user); nos muestra los datos en objecto {} del usuario encontrado
  // console.log(user); //nos votara el usuario en un json donde se guardaran las notas
  const newNote = new Note({
    title,
    content,
    important,
    users: user._id // user DATABASE, user._id es el objeto que recuperamos con la informacion del usuario
    // aqui le damos a la base de datos de notes, en el campo de user le pasamos la informacion del usuario dandole su _id
  })
  try {
    const nuevaNota = await newNote.save()
    // antes de guardar vamos a guardar tambien en nuestro usuario la nota que se esta registrando aqui con su id
    // user.notes es de la informacion que recuperamos arriba del usuario, entramos en su variable notes y concatenamos la nueva infomracion
    // que estamos guardando y le pasamos la _id de la nueva nota desde la base de datos
    user.notes = user.notes.concat(nuevaNota._id)
    await user.save() // esperamos a que se guarde el proceso
    res.status(201).json(nuevaNota) // terminamos el proceso enviando al cliente la nueva nota guardada
  } catch (err) {
    // console.log(err);
    next(err)
  }
})
// probar el user
notesR.put('/:id', async (req, res, next) => {
  const id = req.params.id
  const { title, content, userId } = req.body
  // por ahora solo actualizaremos estos campos
  try {
    if (req.body.title && req.body.content) {
      const notePut = { title, content }
      const data = await Note.updateOne({ _id: id }, notePut)
      return res.status(200).json(data)
    } else if (req.body.userId) {
      const user = await User.findById(userId) // encontramos la informacion del usuario
      const note = await Note.findById(id) // encontramos la informacion de la nota para actualizar un campo

      const userNote = {
        users: user._id
      }
      const noteUser = {
        notes: note._id
      }
      const newUserForNote = await Note.updateOne({ _id: id }, userNote)
      // console.log(userId);
      await User.updateOne({ _id: userId }, noteUser) // actualizamos un campo del usuario
      return res.status(200).json(newUserForNote)
    }
  } catch (err) {
    next(err)
  }

  // funciona carajo, luego darle arreglos en el testing
  // falta pensar un poquin POR AQUI, lo revize y esta iedno bien, si uno de los datos no existe desaparece de los campos en ref
  // nooo, para el cliente desaparece pero para el backend, tenemos que eliminarlo en el backend si eliminan alguna nota o usuario
})
// eliminamos una nota y tambien del usuario
notesR.delete('/:id', async (req, res, next) => {
  const id = req.params.id
  try {
    const data = await Note.findOneAndRemove({ _id: id })
    res.status(200).json(data)
  } catch (err) {
    next(err)
  }
})

// midleware HANDLEERRORS manejando errores de las notas
notesR.use(errorNotes)

module.exports = notesR
