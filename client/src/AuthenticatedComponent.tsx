import React, { useEffect } from 'react'
import { useAuth } from './AuthContext'
import Login from './components/main/login/Login'

interface Props {
  children: React.ReactNode
}

const AuthenticatedComponent: React.FC<Props> = ({ children }) => {
  const { state, dispatch } = useAuth()

  useEffect(() => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; jwtToken=`)
    if (parts.length === 2) {
      const token = parts.pop()?.split(';').shift() as string

      if (token === 'undefined') dispatch({ type: 'LOGOUT' })
      else dispatch({ type: 'LOGIN', payload: { token } })
    }
  }, [])

  if (!state.isAuthenticated) return <Login />
  return <>{children}</>
}

export default AuthenticatedComponent
