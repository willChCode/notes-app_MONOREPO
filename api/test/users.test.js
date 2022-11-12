// NOTAAAA: aprendimos algo chulo el response.body, es la res que recibimos desde el usersApi
// testing user - importamos supertes para testear las rutas
const { api } = require('./helper')
const User = require('../models/usersModel')
const { server } = require('../index')
const mongoose = require('mongoose')

const { initialUser, getUsers } = require('./helper')

beforeEach(async () => {
  // borramos los campos cada que se ejcute el test
  await User.deleteMany({})
  // recorremos el array y añadimos usuarios
  // en datos guardamos el recorrido del array initialUser
  // resultado, dos objetos con todos sus datos{}{} y luego guardarlos los 2 al BD
  for (const datos of initialUser) {
    // NOTAAA:si se usa el User necesitamos poner los campos del modelo user, la que entra realmente a la BD
    // esto no funciona como el req.body va mas al modelo user para verificar los campos
    const userInitial = new User(datos) // guardamos en una constante los objetos encontrados {},{} le damos en el shcema del User
    await userInitial.save() // guardamos esos dos objetos a la base de datos usando save del modelo User
  }
})
describe('GET /api/users', () => {
  test('probando si manda bien la ruta', async () => {
    await api.get('/api/users').expect(200).expect('Content-Type', /json/)
  })
  test('probando si nos llega los archivos con get', async () => {
    const buscar = User.find({}) // probamos si funca el get
    await api
      .get('/api/users')
      .send(buscar)
      .expect(200)
      .expect('Content-Type', /json/)
  })
  test('probando si escribimos mal la ruta - MANEJO DE ERROR', async () => {
    await api.get('/api/userss').expect(404)
  })
  test('probando si contiene una informacion dentro de la BD y si la longitud coincide', async () => {
    // traemos la funcion del helper
    const { name, response } = await getUsers()
    // esperamos que name contenga maria en unos de sus valores
    expect(name).toContain('maria') // true
    // comparamos si la longitud cuerpo de la respuesta es igual a la de nuestro initialUser que seria los datos que tiene la BD
    expect(response.body).toHaveLength(initialUser.length)
  })
})
describe('POST /api/users', () => {
  // NOTAAAAA: aprendimos que el newUser seria como el req.body el cuerpo de la solicitud
  test('testeando la respuesta de nuestro POST', async () => {
    const newUser = {
      name: 'juaquin',
      username: 'jsua121',
      password: '1234'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /json/) // true coincide con la respuesta
    // verificando si contiene el nombre del nuevo user en los datos guardados de la bd
    const { name, response } = await getUsers()
    expect(name).toContain(newUser.name)
    // viendo la longitud del response comparando con la longitud inicial de nuestro datos
    expect(response.body).toHaveLength(initialUser.length + 1)
  })
  test('verificando errores de respuesta del POST', async () => {
    // campos requeridos, si no contiene un campo error
    const newUser = {
      // name: "juaquin",
      username: 'jsua121',
      password: '1234'
    }
    const response = await api.post('/api/users').send(newUser).expect(400)
    // console.log(response.body.name);
    expect(response.body.error).toContain('error de validacion')
  })
  test('verificando si el username es unico', async () => {
    const { username } = await getUsers()
    const userN = username[0]
    console.log(userN)
    const newUser = {
      name: 'sdas',
      username: userN,
      password: '1234'
    }
    const result = await api.post('/api/users').send(newUser).expect(400)
    console.log('________________WILL__________________')
    // console.log(result.body);
    // al importar la libreria mongoose-unique-validate, nos manda una respuesta que contiene un json
    expect(result.body.error1).toContain('valor Unico')
  })
})
describe('PUT /api/users', () => {
  test('verificando la respuesta del PUT', async () => {
    const { id } = await getUsers()
    // esto funca como nuestro req.body
    // testing FUNCA bien con name o username
    const userId = id[0]
    const newName = {
      name: 'nuevoNAME'
    }
    await api
      .put(`/api/users/${userId}`)
      .send(newName)
      .expect(200)
      .expect('Content-Type', /json/)
  })
  test('verifivando los fallos de respuesta del PUT', async () => {
    const userId = '12312'
    const newName = {
      name: 'will'
    }
    const response = await api
      .put(`/api/users/${userId}`)
      .send(newName)
      .expect(400)
      .expect('Content-Type', /json/)
    console.log('__SDASDAS__________')
    console.log(response.body)
    expect(response.body.error).toContain('el ID es incorrecto')
  })
})
describe('DELETE /api/users', () => {
  test('probando la respuesta del DELETE', async () => {
    const { id } = await getUsers()
    const userId = id[0]
    await api
      .delete(`/api/users/${userId}`)
      .expect(200)
      .expect('Content-Type', /json/)
  })
  test('manejando errores de respuesta para el DELETE', async () => {
    const userId = 'sads'
    const response = await api
      .delete(`/api/users/${userId}`)
      .expect(400)
      .expect('Content-Type', /json/)
    expect(response.body.error).toContain('el ID es incorrecto')
  })
})

// tenemos que cerrar las conexiones pejis
afterAll(() => {
  mongoose.connection.close()
  server.close()
})
