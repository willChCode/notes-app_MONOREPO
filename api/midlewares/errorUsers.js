module.exports = (error, req, res, next) => {
  // console.log(error.name)
  if (error.name === 'ValidationError') {
    res.status(400).json({
      error: 'error de validacion campos REQUERIDOS',
      error1: 'valor Unico, complete con otros datos'
    })
  } else if (error.name === 'CastError') {
    return res
      .status(400)
      .json({ error: 'el ID es incorrecto ObjectId failed ' })
  }
}
