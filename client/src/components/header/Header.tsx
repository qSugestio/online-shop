import { useContext, useEffect, useState } from 'react'
import { useAuth } from '../../AuthContext'
import { Context } from '../app/App'
import './Header.css'

const Header = ({
  showCartPage,
  setShowCartPage,
  showAdminPanel,
  setShowAdminPanel,
}: {
  showCartPage: boolean
  setShowCartPage: React.Dispatch<React.SetStateAction<boolean>>
  showAdminPanel: boolean
  setShowAdminPanel: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const { state, dispatch } = useAuth()
  const { setSearchData } = useContext(Context)

  const handleLogout = () => dispatch({ type: 'LOGOUT' })

  const [username, setUsername] = useState('')

  function getUsername() {
    const value = `; ${document.cookie}`
    const parts = value.split(`; username=`)

    if (parts.length === 2) {
      const username = parts.pop()?.split(';').shift() as string
      setUsername(username)
    }
  }

  useEffect(() => {
    getUsername()
  })

  return (
    <div className='header'>
      <h1 className='title'>Phone Store</h1>
      <input
        type='text'
        className='search'
        placeholder='Поиск'
        onChange={event => setSearchData(String(event.target.value))}
      />

      {state.isAuthenticated ? (
        <div className='header-container'>
          <div>
            <button
              type='button'
              className='btn'
              onClick={() => {
                setShowAdminPanel(!showAdminPanel)
                setShowCartPage(false)
              }}
            >
              ADMIN
            </button>
            <button
              type='button'
              className='btn'
              onClick={() => {
                setShowCartPage(!showCartPage)
                setShowAdminPanel(false)
              }}
            >
              Корзина
            </button>
          </div>
          <div>
            <p>{username}</p>
            <button
              className='btn'
              onClick={handleLogout}
              style={{
                width: '100px',
                padding: '0px',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{ color: '#101012', backgroundColor: '#101012' }}
          onClick={() => setShowCartPage(!showCartPage)}
        >
          Корзина
        </div>
      )}
    </div>
  )
}

export default Header
