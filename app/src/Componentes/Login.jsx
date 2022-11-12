import './Login.css'
import { useState } from 'react'
import { InputText, InputPas } from './Inputs'
import serviceLogin from '../backend/Login'
import { Register } from './Register'
import Toggable from './Toggable'

export function Login({ setUserLogin }) {
  // hooks
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  // const [userLogin, setUserLogin] = useState(null);

  const handleInputU = e => {
    setUsername(e.target.value)
  }
  const handleInputP = e => {
    setPassword(e.target.value)
  }
  // login
  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const datos = {
        // enviarlo como parametros y no props
        username,
        password
      }
      const respuesta = await serviceLogin.login(datos)
      window.localStorage.setItem('user', JSON.stringify(respuesta))
      setUserLogin(respuesta) // guardamos en el setUser para que detente cambio en el estado
      // NOTITA ESTO  SE VA PONER NULL LUEGO de que se inicie de nuevo
      setUsername('')
      setPassword('')
    } catch (err) {
      // console.log(err);
      setError('Usuario o Password Incorrecto')
      setTimeout(() => {
        setError(null)
      }, 4000)
    }
  }
  // console.log(userLogin);
  // estilos en linea condicionables
  // const hidenWhenVisible = { display: loginVisible ? "none" : "" };
  // const showWhenVisible = { display: loginVisible ? "" : "none" };

  return (
    <Toggable nameButton='Show Login'>
      <form className='formLogin' onSubmit={handleSubmit}>
        <h1 className='flH1'>Hello Again!</h1>
        <InputText ev={handleInputU} plch='usuario' hook={username} />
        <InputPas ev={handleInputP} hook={password} />
        <p className='flPError'>{error !== null ? error : null}</p>
        <button className='flButton'>login</button>
        <p className='flParrafo'>
          Not a member?{' '}
          <a className='flLink' href=''>
            Register now
          </a>
        </p>
      </form>
      <Register />
    </Toggable>
  )
}
