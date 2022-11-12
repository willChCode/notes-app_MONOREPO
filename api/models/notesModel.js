const { Schema, model } = require('mongoose')

const noteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  important: {
    type: Boolean,
    default: false
  },
  // realacion con la tabla User
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
})
// config
// le mandamos esta visibilidad al from
noteSchema.set('toJSON', {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id
    delete returnObject._id
    delete returnObject.__v
  }
})

// model
const Note = model('Note', noteSchema)

// export
module.exports = Note
