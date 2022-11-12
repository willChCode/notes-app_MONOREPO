// requerimos los campos
// TESTING COMPLETED - pequeñas cositas que verificar
const { api, initialNotes, getNotes } = require('./helper')
const { server } = require('../index')
const mongoose = require('mongoose')
const Note = require('../models/notesModel')

beforeEach(async () => {
  await Note.deleteMany({}) // eliminamos todos los datos cada que se recargue
  for (const data of initialNotes) {
    // for of para recorrer el array [{},{}]
    const notesInitial = new Note(data) // en notel initial guardamos el {},{}
    await notesInitial.save() // y aqui guardamos en la bd los {info},{info}
  }
})

// GET
describe('GET /api/notes', () => {
  test('probando la respuesta del GET', async () => {
    const response = await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /json/)
    // console.log(response.body);
    // probamos si tiene la misma longitud
    expect(response.body).toHaveLength(initialNotes.length) // true si funca bien
    // probamos si contiene una nota encontrada
    const title = await response.body.map(e => e.title) // recorremos el cuerpo de la respuesta y sacamos el titulo
    expect(title).toContain(initialNotes[0].title)
  })
  test('probando errores de respuesta GET', async () => {
    // eslint-disable-next-line no-unused-vars
    const response = await api.get('/api/notess').expect(404)
    // console.log("SSSSSSSSSSSSSSSSS");
    // console.log(response);
  })
})
// POST
describe('POST /api/notes', () => {
  test('validando la respuesta del POST', async () => {
    // req.body
    const newNote = {
      title: 'nota 3',
      content: 'notasdasdas',
      important: true,
      userId: '6358a8c96cb53632b0db8ff5'
    }
    await api
      .post('/api/notes')
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /json/)
    // console.log(response.body);
    // compararemos la longitud si puso un nuevo documento en la BD
    // lo hacemos recorriendo las Notes no con el response, porque solo nos vota la resouesta creada
    // MEJOR hacemos si tiene un contenido de la nueva nota creada
    const notas = await Note.find()
    const title = notas.map(e => e.title)
    expect(title).toContain(newNote.title)
  })
  test('validadon errores de respuesta del POST', async () => {
    const newNote = {
      title: 'nota 3',
      // content: "notasdasdas",
      important: true,
      userId: '6358a8c96cb53632b0db8ff5'
    }
    const response = await api
      .post('/api/notes')
      .send(newNote)
      .expect(400)
      .expect('Content-Type', /json/)
    // console.log(response.body); //datos del error
    // validando nuestro mensaje de error
    // usando MIDLEWARE
    expect(response.body.error).toContain('Completa los campos')
  })
})
// PUT
describe('PUT /api/notes', () => {
  test('testing a la respuesta del PUT', async () => {
    const { id } = await getNotes()
    const noteId = id[0]
    // en el req, solo tenemos dos formas de hacer que son con el title y content, password
    const newNote = {
      title: 'actualizado teting',
      content: 'sdasdastesting'
    }
    await api
      .put(`/api/notes/${noteId}`)
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /json/)
    // console.log(response.body); nos responde true
  })
  test('validando errores de respuesta PUT', async () => {
    const noteId = '123'
    const newNote = {
      title: 'actualizado teting',
      content: 'sdasdastesting'
    }
    const response = await api
      .put(`/api/notes/${noteId}`)
      .send(newNote)
      .expect(400)
    // console.log(response.body); //visualizamos informacion del error
    console.log(response.body)
    expect(response.body.error).toContain('el ID es incorrecto')
  })
})
describe('DELETE /api/notes', () => {
  test('validando la respuesta del DELETE', async () => {
    const { id } = await getNotes()
    const noteId = id[0]
    await api
      .delete(`/api/notes/${noteId}`)
      .expect(200)
      .expect('Content-Type', /json/)
    // console.log(response.body);
  })
  test('validadon errores de respuesta del DELETE', async () => {
    const noteId = 'sda'
    const response = await api
      .delete(`/api/notes/${noteId}`)
      .expect(400)
      .expect('Content-Type', /json/)
    // console.log(response.body);
    // validadno el tipo de error obteniedno su nombre
    // expect(response.body.name).toContain("CastError");
    expect(response.body.error).toContain('el ID es incorrecto')
  })
})

// crreamos conexiones
afterAll(() => {
  mongoose.connection.close()
  server.close()
})
