import { useEffect, useState } from 'react'
import { useAuth } from '../../../AuthContext'
import { ProductT } from '../../../types/types'
import './Sidebar.css'

const Sidebar: React.FC<{
  filter: (
    brand: string[],
    rom: string[],
    ram: string[],
    from: string,
    to: string
  ) => void
}> = ({ filter }) => {
  const [data, setData] = useState<ProductT[] | null>(null)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const { state } = useAuth()

  const getData: () => Promise<ProductT[]> = async () => {
    try {
      const response = await fetch(
        'http://localhost:5100/api/data?sidebar=true'
      )

      return response.json()
    } catch (error) {
      console.error('Error fetching data: ', error)
    }
  }

  const [brandFilter, setBrandFilter] = useState<string[]>([])
  const [romFilter, setRomFilter] = useState<string[]>([])
  const [ramFilter, setRamFilter] = useState<string[]>([])

  useEffect(() => {
    getData().then(data => setData(data))

    filter(brandFilter, romFilter, ramFilter, from, to)
  }, [brandFilter, romFilter, ramFilter, from, to])

  const handleChange = (
    value: string,
    filterState: string[],
    setFilterState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (filterState.includes(value)) {
      setFilterState(filterState.filter(item => item !== value))
    } else {
      setFilterState([...filterState, value])
    }
  }

  const renderUniqueBrandCheckboxes = (
    phones: ProductT[],
    filter: string,
    filterState: string[],
    setFilterState: React.Dispatch<React.SetStateAction<string[]>>,
    text: string
  ) => {
    return phones
      .filter(
        (phone, index, self) =>
          self.findIndex(p => p[filter] === phone[filter]) === index
      )
      .map(phone => (
        <li key={phone.brand + phone.price + filter}>
          <input
            type='checkbox'
            id={phone[filter]}
            onChange={() =>
              handleChange(phone[filter], filterState, setFilterState)
            }
            checked={filterState.includes(phone[filter])}
          />
          <label htmlFor={phone[filter]}>
            {phone[filter]} {text}
          </label>
        </li>
      ))
  }

  return (
    <div className='sidebar'>
      <div>
        <h3>Цена</h3>
        <input
          type='number'
          className='price-range'
          placeholder='от'
          onChange={event => setFrom(event.target.value)}
        />
        <input
          type='number'
          className='price-range'
          placeholder='до'
          onChange={event => setTo(event.target.value)}
        />
      </div>
      <div>
        <h3>Производитель</h3>
        <ul>
          {data
            ? renderUniqueBrandCheckboxes(
                data,
                'brand',
                brandFilter,
                setBrandFilter,
                ''
              )
            : ''}
        </ul>
      </div>
      <div>
        <h3>Встроенная память</h3>
        <ul>
          {data
            ? renderUniqueBrandCheckboxes(
                data,
                'rom',
                romFilter,
                setRomFilter,
                'ГБ'
              )
            : ''}
        </ul>
      </div>
      <div>
        <h3>Оперативная память</h3>
        <ul>
          {data
            ? renderUniqueBrandCheckboxes(
                data,
                'ram',
                ramFilter,
                setRamFilter,
                'ГБ'
              )
            : ''}
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
