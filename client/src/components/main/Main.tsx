import { useContext, useEffect, useState } from 'react'
import './Main.css'

import { useAuth } from '../../AuthContext'
import { ProductT } from '../../types/types'
import { Context } from '../app/App'
import Product from './product/Product'
import Sidebar from './sidebar/Sidebar'

const Main = () => {
  const [showButton, setShowButton] = useState(true)
  const [currentPage, setCurrentPage] = useState(2)
  const [data, setData] = useState<ProductT[] | null>(null)
  const { searchData } = useContext(Context)
  const { state } = useAuth()
  const PORT = 5100

  const getData: () => Promise<ProductT[]> = async () => {
    const queryParams = new URLSearchParams()
    if (searchData !== '') queryParams.append('searchText', searchData)

    const url = `http://localhost:${PORT}/api/data?${queryParams.toString()}`
    return await fetch(url, {
      headers: { Authorization: 'Bearer ' + state.token },
    }).then((res: Response) => {
      if (!res.ok) throw new Error('data is null')

      return res.json()
    })
  }

  const filterData = async (
    brands: string[],
    roms: string[],
    rams: string[],
    from: string,
    to: string
  ) => {
    setCurrentPage(2)
    const queryParams = new URLSearchParams()

    brands.forEach(brand => queryParams.append('brand', brand))
    roms.forEach(rom => queryParams.append('rom', rom))
    rams.forEach(ram => queryParams.append('ram', ram))
    if (from !== '') queryParams.append('from', from)
    if (to !== '') queryParams.append('to', to)

    const url = `http://localhost:${PORT}/api/data?${queryParams.toString()}`
    if (queryParams.size !== 0) setShowButton(false)
    else setShowButton(true)

    fetch(url, {
      headers: {
        Authorization: 'Bearer ' + state.token,
      },
    })
      .then(res => res.json())
      .then(data => setData(data))
  }

  useEffect(() => {
    getData()
      .then((data: any) => setData(data))
      .catch(err => console.error(err))
  }, [searchData, state.isAuthenticated])

  const loadNewData = () => {
    if (data === null) return
    setCurrentPage(currentPage + 1)

    fetch(`http://localhost:${PORT}/api/data?page=${currentPage}`, {
      headers: { Authorization: 'Bearer ' + state.token },
    })
      .then(res => res.json())
      .then(newData => {
        if (newData[0] === undefined) setShowButton(false)
        setData([...data, ...newData])
      })
  }

  return (
    <div>
      <div className='container'>
        <Sidebar filter={filterData} />
        <div>
          {data ? (
            data.map(phone => (
              <Product
                id={phone.id}
                brand={phone.brand}
                model={phone.model}
                rom={phone.rom}
                ram={phone.ram}
                price={phone.price}
                img={phone.img}
                key={phone.brand + phone.model + phone.id}
                cart={false}
              />
            ))
          ) : (
            <div>Данные отсутствуют</div>
          )}
          {showButton && (
            <button className='btn' onClick={loadNewData}>
              Загрузить ещё
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Main
