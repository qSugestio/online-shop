import { useEffect, useState } from 'react'
import { useAuth } from '../../AuthContext'
import './AdminPanel.css'

const AdminPanel = () => {
  const { state } = useAuth()
  const [data, setData] = useState([])

  useEffect(() => {
    const url = 'http://localhost:5100/api/adminPanel'
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + state.token,
      },
    })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok')
        else return response.json()
      })
      .then(data => setData(data))
      .catch(err => console.error(err))
  }, [])

  return (
    <>
      {data ? (
        <div>
          {data.map((item: any) => (
            <div>
              <span>={item.id}</span>
              <span>={item.username}</span>
              <span>={item.role}</span>
              <span>=cart:</span>
              <div>
                {item.cart.map((phone: any) => (
                  <>
                    <span>={phone.id}</span>
                    <span>={phone.brand}</span>
                    <span>={phone.model}</span>
                    <span>={phone.rom}</span>
                    <span>={phone.ram}</span>
                    <span>={phone.price}</span>
                  </>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>Данные отсутствуют</div>
      )}
    </>
  )
}

export default AdminPanel
