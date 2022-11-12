// DATAAASO : una mejor forma de refactorizar y ver que sea leible nuestros errores
// esto funciona facil creamos un objeto con los tipos de errores y le damos parametros como una funcion
// desde ese error y luego desde los datos incial del export llamamos a este objeto
const handleErrors = {
  CastError: res => res.status(400).json({ error: 'el ID es incorrecto' }),

  // error 409 luego arreglar por el test va fallar
  ValidationError: (res, error) =>
    res.status(400).json({ error: 'Completa los campos son requeridos' }),

  JsonWebTokenError: (res, error) =>
    res.status(401).send({ error: error.message }),

  TokenExpirerError: res =>
    res.status(401).json({
      error: 'token expirado'
    }),

  defaultError: res => res.status(500).end() // error del sistema
}

module.exports = (error, req, res, next) => {
  // console.log(error); //con esto vemos el error que esta entrando en nuestro middleware
  // console.log("__________________________");
  console.log(error.name)
  // desde aqui llamamos al  objeto que contiene todos los errores, y de aqui guardamos en una constante para darle el nombre del error
  // y si no lo pilla que le pase el defaultError, NOTAAA: le pasamos en un array porque tiene que ser en la posicion cero donde estan todos los datos
  const handle = handleErrors[error.name] || handleErrors.defaultError
  // una vez guardado el nombre del error, le mandamos el parametro para que cumpla la funcion
  handle(res, error)
}
