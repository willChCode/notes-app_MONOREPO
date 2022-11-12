// no me reconica test, lo requeri desde aqui y funciono
// o usar la documentacion que dice que se llame con request
const supertest = require('supertest')
const { app } = require('../index')
const api = supertest(app)

// sacamos los datos del modelo Schema bd, tener cuidado con los campos
const initialUser = [
  {
    name: 'will',
    username: 'willch1123',
    passwordHash: '1234',
    notas: []
  },
  {
    name: 'maria',
    username: 'maria123s',
    passwordHash: '123412',
    notas: []
  }
]
// in longitud, of los datos
// for (const user of initialUser) {
//   console.log(user);
// }

// creamos una funcion para obtener los datos del usuarios ya recoridos y tambien recuperar el cuerpo de la respuesta
// esto solo es el cuerpo no la BASE DE DATOS en si
const getUsers = async () => {
  // console.log(response.body); esto nos manda la respuesta del json osea lo que encuentra en el usersApi toda la info
  const response = await api.get('/api/users')
  return {
    // eslint-disable-next-line object-shorthand
    response: response,
    name: await response.body.map(e => e.name),
    username: await response.body.map(e => e.username),
    id: await response.body.map(e => e.id)
  }
}

// NOTAS
const initialNotes = [
  {
    title: 'nota 1',
    content: 'contenido 1',
    important: false,
    users: []
  },
  {
    title: 'nota 2',
    content: 'contenido 2',
    important: false,
    users: []
  }
]

// getNotas
const getNotes = async () => {
  const response = await api.get('/api/notes')
  return {
    id: await response.body.map(e => e.id)
  }
}

module.exports = {
  api,
  initialUser,
  getUsers,
  initialNotes,
  getNotes
}
