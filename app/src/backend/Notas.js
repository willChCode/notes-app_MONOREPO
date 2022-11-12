import axios from 'axios'

const baseUrl = '/api/notes'

export const getNotas = async () => {
  const { data } = await axios.get(baseUrl)
  return data
}
export const postNotas = async (datos, { token }) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  console.log(token)
  const { data } = await axios.post(baseUrl, datos, config)
  return data
}
