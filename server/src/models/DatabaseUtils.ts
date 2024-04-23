import mysql from 'mysql'

export default class DatabaseUtils {
  constructor(private connection: mysql.Connection) {}

  public async executeQuery(query: string, values: any): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
        this.connection.query(query, values, (error, results) => {
          if (error) reject(error)
          else resolve(results)
        })
      })
    } catch (error: any) {
      throw new Error('Ошибка выполнения запроса: ' + error.message)
    }
  }
}
