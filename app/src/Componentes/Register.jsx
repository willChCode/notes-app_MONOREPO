import { useState } from 'react'
import { InputText, InputPas } from './Inputs'
import services from '../backend/Login'

export function Register() {
  // hooks
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleInputN = e => {
    setName(e.target.value)
  }
  const handleInputU = e => {
    setUsername(e.target.value)
  }
  const handleInputP = e => {
    setPassword(e.target.value)
  }
  // guardar usuario
  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const datosBody = {
        name,
        username,
        password
      }
      const resB = await services.register(datosBody)
      // console.log(resB);
      setName('')
      setUsername('')
      setPassword('')
      setMessage({ green: `el registro fue con exito ${resB.name}` })
      setTimeout(() => {
        setMessage('')
      }, 4000)
    } catch (err) {
      // console.log(err);
      setMessage({ red: 'Campos requeridos, username ya usado' })
      setTimeout(() => {
        setMessage('')
      }, 4000)
    }
  }
  return (
    <form className='formLogin' onSubmit={handleSubmit}>
      <h1 className='flH1'>Registrate!</h1>
      <InputText ev={handleInputN} plch='name' hook={name} />
      <InputText ev={handleInputU} plch='username' hook={username} />
      <InputPas ev={handleInputP} hook={password} />
      <p
        className='flPError'
        style={message.red ? { color: 'red' } : { color: 'green' }}>
        {message.red || message.green}
      </p>
      <button className='flButton'>Register</button>
      <p className='flParrafo'>
        Not a member?{' '}
        <a className='flLink' href=''>
          Login now
        </a>
      </p>
    </form>
  )
}
