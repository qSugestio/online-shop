import { createContext, useState } from 'react'
import { CartContextType, ContextType, ProductT } from '../../types/types'

import AdminPanel from '../AdminPanel/AdminPanel'
import Header from '../header/Header'
import Main from '../main/Main'
import Cart from '../main/cart/Сart'

export const Context = createContext<ContextType>({
  searchData: '',
  setSearchData: () => {},
})
export const CartContext = createContext<CartContextType>({
  cart: [],
  setCart: () => {},
})

const App = () => {
  const [showCartPage, setShowCartPage] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  const [searchData, setSearchData] = useState('')
  const [cart, setCart] = useState<ProductT[]>([])

  return (
    <div>
      <CartContext.Provider value={{ cart, setCart }}>
        <Context.Provider value={{ searchData, setSearchData }}>
          <Header
            showCartPage={showCartPage}
            setShowCartPage={setShowCartPage}
            showAdminPanel={showAdminPanel}
            setShowAdminPanel={setShowAdminPanel}
          />
          {showCartPage && <Cart />}
          {showAdminPanel && <AdminPanel />}
          {!showAdminPanel && !showCartPage && <Main />}
        </Context.Provider>
      </CartContext.Provider>
    </div>
  )
}

export default App
