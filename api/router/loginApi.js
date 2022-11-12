const bcrypt = require('bcrypt')
const loginR = require('express').Router()
const User = require('../models/usersModel') // requerimos para traer informacion de la BD querys de mongoose
const jwt = require('jsonwebtoken')

loginR.post('/', async (req, res) => {
  const { username, password } = req.body

  const userDatos = await User.findOne({ username })
  // console.log(password);
  // console.log(userDatos.passwordHash);
  const respuesta = await bcrypt.compare(password, userDatos.passwordHash)
  console.log(respuesta)

  const passwordCorrect =
    userDatos !== null
      ? await bcrypt.compare(password, userDatos.passwordHash)
      : false

  // console.log(passwordCorrect); //true o false
  if (!(userDatos && passwordCorrect)) {
    return res.status(401).json({
      error: 'usuario o password invalido'
    })
    // retornamos este error porque sino crashea , return arriba en el res o abajo de todo
  } // NOTAAAAAAAAAAAAAAA: retornamos porque abajo tenemos otro res peji
  // le enviamos al front la informacion del usuario logeado en un send con json

  // una vez logueado guardaremos la informacion en el JSONWEBTOKEN
  const userForToken = {
    id: userDatos._id,
    username: userDatos.username
  }
  // guardamos la info en el JWT
  // la palabra secreta sirve tambien para descodificar la informacion
  // aqui firmamos el token con la palabra secreta y guardar en una constante token
  const token = jwt.sign(userForToken, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24 * 7 // expira en 7dias
  })
  // al cliente respondemos con los datos del name,username y el token que tiene
  res.send({
    name: userDatos.name,
    username: userDatos.username,
    token
  })
})

module.exports = loginR
