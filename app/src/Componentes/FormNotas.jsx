// import {useState} from "react"
import { InputText } from './Inputs'
import { useState } from 'react'

function FormNotas({ addNote }) {
  const [newNota, setNewNota] = useState('')

  const handleChange = e => {
    setNewNota(e.target.value)
  }
  //
  const handleSubmit = e => {
    e.preventDefault()
    const datos = {
      title: newNota,
      content: newNota,
      important: true
    }
    addNote(datos)
    setNewNota('')
  }
  return (
    <>
      <form className='formSave' onSubmit={handleSubmit}>
        <InputText plch='titulo de nota' ev={handleChange} hook={newNota} />
        <button className='flButton'>save</button>
      </form>
    </>
  )
}
export default FormNotas
