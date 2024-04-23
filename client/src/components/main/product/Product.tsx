import { useContext } from 'react'
import { useAuth } from '../../../AuthContext'
import { ProductT, ProductTCart } from '../../../types/types'
import { CartContext } from '../../app/App'
import './Product.css'

const Product: React.FC<ProductTCart> = props => {
  const { cart, setCart } = useContext(CartContext)
  const { state } = useAuth()

  const addToCart = (phoneId: string | null) => {
    if (phoneId) {
      fetch(`http://localhost:5100/api/data?id=${phoneId}`, {
        headers: { Authorization: `Bearer ${state.token}` },
      })
        .then(res => res.json())
        .then((phone: ProductT) => {
          fetch('http://localhost:5100/api/cart/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${state.token}`,
            },
            body: JSON.stringify({ productId: phone.id }),
          })
          setCart([...cart, phone])
        })
    }
  }

  const removeFromCart = (phoneId: string | null) => {
    if (phoneId) {
      fetch('http://localhost:5100/api/cart/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify({ productId: phoneId }),
      })
      const index = cart.findIndex(cart => cart.id === +phoneId)
      if (index !== -1) {
        cart.splice(index, 1)
        const newCart = [...cart]
        setCart(newCart)
      }
    }
  }

  return (
    <div className='product'>
      <div className='flex'>
        <div className='img'>
          {(JSON.parse(props.img) as string[]).map((img, index) => (
            <img
              src={img}
              alt={`phone ${props.brand} ${props.model}`}
              key={props.brand + props.model + index}
              loading='lazy'
            />
          ))}
        </div>
        <div className='info'>
          <h3 className='title'>
            {props.brand} {props.model}
          </h3>
          <div className='description'>
            <p>Память - {props.rom}ГБ</p>
            <p>Оперативная память - {props.ram}ГБ</p>
          </div>
        </div>
      </div>
      <div className='purchase'>
        <div className='price'>{props.price}₽</div>
        {!props.cart ? (
          <button
            type='button'
            className='btn'
            data-phoneid={props.id}
            onClick={event =>
              addToCart(
                (event.target as HTMLInputElement).getAttribute('data-phoneid')
              )
            }
          >
            В Корзину
          </button>
        ) : (
          <button
            type='button'
            className='delete'
            data-phoneid={props.id}
            onClick={event =>
              removeFromCart(
                (event.target as HTMLInputElement).getAttribute('data-phoneid')
              )
            }
          >
            Удалить
          </button>
        )}
      </div>
    </div>
  )
}

export default Product
