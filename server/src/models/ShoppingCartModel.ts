import { Connection } from 'mysql'
import { Product, ProductT } from '../../../client/src/types/types'
import DatabaseUtils from './DatabaseUtils'

class ShoppingCartModel {
  private db: DatabaseUtils
  constructor(connection: Connection) {
    this.db = new DatabaseUtils(connection)
  }

  public async getCart(userId: number): Promise<ProductT> {
    const query = 'SELECT * FROM carts WHERE BINARY userId = ?'
    const cart: Product[] = await this.db.executeQuery(query, userId)

    const phoneGetQuery = 'SELECT * FROM phones WHERE id = ?'
    const phones: any = []

    await Promise.all(
      cart.map(async item => {
        const phone = await this.db.executeQuery(phoneGetQuery, item.productId)
        phones.push(...phone)
      })
    )
    return phones
  }

  public async addToCart(userId: number, productId: number): Promise<any> {
    const query = 'INSERT INTO carts (userId, productId) VALUES (?, ?)'
    await this.db.executeQuery(query, [+userId, +productId])
  }

  public async removeFromCart(userId: number, productId: number): Promise<any> {
    const query = 'DELETE FROM carts WHERE userId = ? AND productId = ? LIMIT 1'
    await this.db.executeQuery(query, [userId, productId])
  }
}

export default ShoppingCartModel
