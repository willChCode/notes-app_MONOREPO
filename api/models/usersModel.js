const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  // la ref es el modelo que es Note
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Note'
    }
  ]
})
// usamos un hook para que antes de guardar algo ejecute esta funcion
// userSchema.pre("save", async function (next) {
//   try {
//     const rounds = 10;

//     const hash = await bcrypt.hash(this.passwordHash, rounds);
//     console.log(
//       "se acaba de encriptar la constraeña antes de guardar los datos :)"
//     );
//     this.passwordHash = hash;
//   } catch (err) {
//     next(err);
//   }
// });

// configuracion para el backend sin modificar la base de datos
// NOTA.- olvido de uso, recurri a un ejemplo
userSchema.set('toJSON', {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id
    delete returnObject._id
    delete returnObject.__v
  }
})
// unico valor pa los campos
userSchema.plugin(uniqueValidator)

// Creacion del modelo para usar las Querys
const User = model('User', userSchema)

module.exports = User
