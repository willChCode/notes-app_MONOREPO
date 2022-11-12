import axios from 'axios'

const loginBaseUrl = 'api/login'
const userBaseUrl = 'api/users'

const login = async datos => {
  // los datos en axios esta en una carpeta data
  // console.log(datos);
  const { data } = await axios.post(loginBaseUrl, datos)
  // console.log(data);
  return data
}
const register = async body => {
  const { data } = await axios.post(userBaseUrl, body)
  return data
}

export default {
  login,
  register
}
