const mongoose = require('mongoose')

const { MONGODB_URL, MONGODB_URL_TEST, NODE_ENV } = process.env
const url = NODE_ENV === 'test' ? MONGODB_URL_TEST : MONGODB_URL

const conexionBD = async () => {
  try {
    await mongoose.connect(url)
    console.log('se ha conectado a BASE DE DATOS')
  } catch (err) {
    console.log(err)
    console.log('PROBLEMAS AL CONECTARSE A LA BASE DE DATOS')
  }
}

module.exports = conexionBD
