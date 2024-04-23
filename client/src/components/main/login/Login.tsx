import { useState } from 'react'
import { useAuth } from '../../../AuthContext'

import Register from '../register/Register'
import './Login.css'

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  const { dispatch } = useAuth()

  const handleLogin = async () => {
    const url = 'http://localhost:5100/api/login'
    const data = { username: login, password }

    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then((data: { token: string; message: string; role: string }) => {
        console.log(data)
        document.cookie = `jwtToken=${data.token}; path=/; max-age=3600` /*1h*/
        document.cookie = `username=${login}`

        if (data.token !== undefined)
          dispatch({ type: 'LOGIN', payload: { token: data.token } })
      })
      .catch(error => console.error('Ошибка: ', error))
  }

  return isLogin ? (
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
        <button onClick={handleLogin} className='btn'>
          login
        </button>
        <button onClick={() => setIsLogin(false)} className='register'>
          register
        </button>
      </div>
    </div>
  ) : (
    <Register setIsLogin={() => setIsLogin(true)} />
  )
}

export default Login
