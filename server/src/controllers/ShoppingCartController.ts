import { Request, Response } from 'express'
import { Connection } from 'mysql'
import ShoppingCartModel from '../models/ShoppingCartModel'

class ShoppingCartController {
  private model: ShoppingCartModel
  constructor(connection: Connection) {
    this.model = new ShoppingCartModel(connection)
  }

  public async getCart(req: Request, res: Response) {
    const { id } = req.body
    try {
      const response = await this.model.getCart(id)
      res.status(200).json(response)
    } catch (error: any) {
      res.status(500).json({ message: 'Error getting cart: ' + error.message })
    }
  }

  public async addToCart(req: Request, res: Response) {
    const { id, productId } = req.body
    try {
      await this.model.addToCart(id, productId)
      res.status(200).json({ message: 'Product successful add' })
    } catch (error: any) {
      res.status(500).json({ message: 'Error add to cart: ' + error.message })
    }
  }

  public async removeFromCart(req: Request, res: Response) {
    const { id, productId } = req.body
    try {
      await this.model.removeFromCart(id, productId)
      res.status(200).json({ message: 'Product successful remove' })
    } catch (error: any) {
      res
        .status(500)
        .json({ message: 'Error remove from cart: ' + error.message })
    }
  }
}

export default ShoppingCartController
