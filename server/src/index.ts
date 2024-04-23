import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import authMiddleware from './middleware/authMiddleware'
import authRouter from './routes/authRouter'
import cartRouter from './routes/cartRouter'
import connection, {
  closeDatabaseConnection,
  openDatabaseConnection,
} from './utils/dbUtils'
import getData from './utils/getData'
dotenv.config()

const PORT = process.env.PORT

const app = express()
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

openDatabaseConnection()

app.get('/api/data', getData)
app.get(
  '/api/adminPanel',
  authMiddleware,
  async (req: Request, res: Response) => {
    const { role } = req.body
    if (role !== 'ADMIN')
      return res.status(403).json({ message: 'У вас нет доступа' })

    const query = 'SELECT * FROM users'
    connection.query(query, async (error: any, results: any[]) => {
      const newArray: any = []

      for (const obj of results) {
        const userCartQuery = 'SELECT * FROM carts WHERE BINARY userId = ?'
        const cart: any[] = await new Promise((resolve, reject) => {
          connection.query(userCartQuery, obj.id, (error: any, cart: any[]) => {
            if (error) {
              reject(error)
            } else {
              resolve(cart)
            }
          })
        })

        const phonesPromises: Promise<any>[] = []
        for (const phone of cart) {
          const phoneQuery = 'SELECT * FROM phones WHERE BINARY id = ?'
          const phoneValue = (phone as any).productId
          phonesPromises.push(
            new Promise((resolve, reject) => {
              connection.query(
                phoneQuery,
                [phoneValue],
                (error: any, result: any) => {
                  if (error) {
                    reject(error)
                  } else {
                    resolve(result)
                  }
                }
              )
            })
          )
        }

        const phones: any[] = await Promise.all(phonesPromises)

        newArray.push({ ...obj, cart: phones })
      }

      const finalResult = newArray.map((item: any) => ({
        ...item,
        cart: item.cart.flatMap((phones: any) => phones),
      }))

      res.json(finalResult)
    })
  }
)
app.use('/api/cart', cartRouter)
app.use('/api', authRouter)

app.use((req: Request, res: Response, next: () => void) => {
  closeDatabaseConnection(res)
  next()
})

app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`))
