import { useState } from 'react'
import { useAuth } from '../../../AuthContext'

import './Register.css'

interface props {
  setIsLogin: () => void
}

const Register = ({ setIsLogin }: props) => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  const { dispatch } = useAuth()

  const handleRegister = async () => {
    const url = 'http://localhost:5100/api/register'
    const data = { username: login, password }

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then((data: { token: string; message: string }) => {
        document.cookie = `jwtToken=${data.token}; path=/; max-age=3600` /*1h*/
        document.cookie = `username=${login}`

        if (data.token !== undefined)
          dispatch({ type: 'LOGIN', payload: { token: data.token } })
      })
      .catch(error => console.error('Ошибка: ', error))
  }

  return (
    <div className='div-container'>
      <div className='login-form'>
        <input
          type='text'
          maxLength={15}
          className='login-input'
          onChange={element => setLogin(element.target.value)}
        />
        <input
          type='text'
          maxLength={20}
          className='login-input'
          onChange={element => setPassword(element.target.value)}
        />
        <button onClick={handleRegister} className='btn'>
          register
        </button>
        <button onClick={() => setIsLogin()} className='register'>
          login
        </button>
      </div>
    </div>
  )
}

export default Register
