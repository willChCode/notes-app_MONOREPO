export function InputText({ ev, plch, hook }) {
  return (
    <input
      onChange={ev}
      className='flInput'
      type='text'
      placeholder={plch}
      value={hook}
    />
  )
}
export function InputPas({ ev, hook }) {
  return (
    <input
      onChange={ev}
      className='flInput'
      type='password'
      placeholder='ingrese el password'
      value={hook}
    />
  )
}
