import { Login } from './Componentes/Login'
import './App.css'
import { useState, useEffect } from 'react'
import { Notas } from './Componentes/Notas'

function App() {
  const [userLogin, setUserLogin] = useState(null)

  console.log('holaaa')
  useEffect(() => {
    const loggedUser = window.localStorage.getItem('user')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUserLogin(user)
    }
  }, [])
  // console.log(userLogin);

  return (
    <main className='app'>
      {userLogin !== null ? (
        <Notas userLogin={userLogin} setUserLogin={setUserLogin} />
      ) : (
        <Login setUserLogin={setUserLogin} />
      )}
    </main>
  )
}

export default App
