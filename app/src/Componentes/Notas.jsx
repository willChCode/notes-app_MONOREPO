import { useState, useEffect } from 'react'
import { getNotas, postNotas } from '../backend/Notas'
import FormNotas from './FormNotas'
import Toggable from './Toggable'
// import  from "./FormNotas"

function ArrayNotas({ e }) {
  return (
    <>
      <li className='notasTit'>
        <strong>{e.title}</strong>
      </li>
      <p className='notasCon'>{e.content}</p>
      <button
        className='notasImp'
        style={
          e.important === true
            ? { backgroundColor: 'green' }
            : { backgroundColor: '#f86a68' }
        }>
        {e.important === true ? 'tarea completada' : 'tarea incompleta'}
      </button>
    </>
  )
}

export function Notas({ userLogin, setUserLogin }) {
  const [notas, setNotas] = useState([])

  useEffect(() => {
    getNotas().then(res => setNotas(res))
  }, [])
  // guardar nota
  // ESTUDIAR ESTA PARTE refactorizacion en funciones partidas en 2
  const addNote = datos => {
    const { token } = userLogin
    postNotas(datos, { token }).then(returnNota =>
      setNotas(notas.concat(returnNota))
    )
    console.log('guardar nota')
  }

  const handleLogout = () => {
    console.log('logout')
    setUserLogin(null)
    window.localStorage.removeItem('user')
  }
  return (
    <>
      <section className='notaWelcome'>
        <h1 className='h1User'>Bienvenido {userLogin.name}</h1>
        {/* props Children diferente a los props - no debe ir aqui xd pero con esto vemos que el vissible y hiden funcionan en cualquier componente */}
        <Toggable nameButton='show'>otro mensaje</Toggable>
        <button className='bLogout' onClick={handleLogout}>
          Logout
        </button>
      </section>
      <FormNotas addNote={addNote} />
      <Toggable nameButton='show notas'>
        <ol className='getNotas'>
          {notas.map(e => (
            <ArrayNotas key={e.id} e={e} />
          ))}
        </ol>
      </Toggable>
    </>
  )
}
