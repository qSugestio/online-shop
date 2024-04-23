import { useContext, useEffect, useState } from 'react'
import { useAuth } from '../../../AuthContext'
import AuthenticatedComponent from '../../../AuthenticatedComponent'
import { CartContext } from '../../app/App'
import Product from '../product/Product'
import './Cart.css'

const Сart = () => {
  const { state } = useAuth()
  const { cart, setCart } = useContext(CartContext)
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    fetch('http://localhost:5100/api/cart', {
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
      .then((data: any) => setCart([].concat(...data)))
      .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    setTotalPrice(
      cart.reduce((acc, phone) => acc + +phone.price.replace(/\s/g, ''), 0)
    )
  }, [cart])

  return (
    <AuthenticatedComponent>
      <div className='container-cart'>
        {cart ? (
          cart.map(phone => (
            <Product
              id={phone.id}
              brand={phone.brand}
              model={phone.model}
              rom={phone.rom}
              ram={phone.ram}
              price={phone.price}
              img={phone.img}
              key={phone.brand + phone.model + phone.id + Math.random()}
              cart={true}
            />
          ))
        ) : (
          <div>Данные отсутствуют</div>
        )}
      </div>
      <div className='footer'>Итоговая цена - {totalPrice}₽</div>
    </AuthenticatedComponent>
  )
}

export default Сart
