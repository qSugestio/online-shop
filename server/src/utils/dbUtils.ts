import dotenv from 'dotenv'
import { Response } from 'express'
import mysql from 'mysql'
dotenv.config()

const connection = mysql.createConnection({
  host: process.env.HOST_DB,
  user: process.env.USER_DB,
  password: process.env.PASSWORD_DB,
  database: process.env.DATABASE,
})

export const openDatabaseConnection = () => {
  connection.connect((err: { stack: string }) => {
    if (err)
      return console.error('Ошибка соединения с базой данных ' + err.stack)
    console.log('Соединение с базой данных установлено')
  })
}
export const closeDatabaseConnection = (res: Response) => {
  connection.end(err => {
    if (err)
      res
        .status(500)
        .json({ message: 'Ошибка при закрытии соединения: ' + err.message })
    else res.json({ message: 'Соединение с базой данных успешно закрыто' })
  })
}

export default connection
