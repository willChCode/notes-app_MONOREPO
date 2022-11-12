import React, { useState } from 'react'
import PropTypes from 'prop-types'

// props children , funciona como una etiqueta lo que contiene dentro de la etiqueta togable lo renderizamos con props children y lee el mensaje
// a este componente podemos pasarle lo que sea, puede ser etiquetas html, componentes, etc.
// usamos props children y props para hacer un componente potente xd
function Toggable({ children, nameButton }) {
  const [visible, setVisible] = useState(false)

  const hiddenWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  return (
    <div className='toggable'>
      <div style={hiddenWhenVisible}>
        <button onClick={() => setVisible(true)}>{nameButton}</button>
      </div>
      <div style={showWhenVisible}>
        <button className='buttonTog' onClick={() => setVisible(false)}>
          cancel
        </button>
        {children}
      </div>
    </div>
  )
}
// le da un nombre a nuestro componente
Toggable.displayName = 'Toggable'
// esto es solo informativo
// definir tipos de prototipos que valor reciben y si es requerido
Toggable.propTypes = {
  nameButton: PropTypes.string.isRequired
}

export default Toggable
