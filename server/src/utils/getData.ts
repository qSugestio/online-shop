import { Response } from 'express'
import connection from './dbUtils'

const getData = (req: any, res: Response) => {
  connection.query('SELECT * FROM phones', (error: any, results: any[]) => {
    if (error)
      return res
        .status(500)
        .json({ error: 'Ошибка получения данных из базы данных' })

    if (req.query.sidebar) return res.send(results)

    if (req.query.id)
      return res.send(
        results.find((phone: { id: number }) => phone.id === +req.query.id)
      )

    const page = req.query.page ? parseInt(req.query.page) : 1
    const itemsPerPage = 5
    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage

    if (req.query.page !== undefined) return res.send(results.slice(start, end))

    const { searchText, from, to, ...filters } = req.query

    const applyFilter = (phone: { [x: string]: any }) => {
      return Object.entries(filters).every(([key, value]) => {
        if (Array.isArray(value)) {
          return value.includes(phone[key])
        } else {
          return phone[key] === value
        }
      })
    }

    let filteredData = results.filter(applyFilter)

    if (searchText) {
      const normalizedSearchText = searchText.toLowerCase()

      filteredData = filteredData.filter(
        (phone: { brand: string; model: string }) =>
          phone.brand.toLowerCase().includes(normalizedSearchText) ||
          phone.model.toLowerCase().includes(normalizedSearchText) ||
          `${phone.brand} ${phone.model}`
            .toLowerCase()
            .includes(normalizedSearchText)
      )
    }

    if (from && to) {
      filteredData = filteredData.filter(
        (phone: { price: string }) =>
          +phone.price.replace(/\s/g, '') > +from &&
          +phone.price.replace(/\s/g, '') < +to
      )
    } else if (from) {
      filteredData = filteredData.filter(
        (phone: { price: string }) => +phone.price.replace(/\s/g, '') > +from
      )
    } else if (to) {
      filteredData = filteredData.filter(
        (phone: { price: string }) => +phone.price.replace(/\s/g, '') < +to
      )
    }

    return res.json(filteredData.slice(start, end))
  })
}

export default getData
