import express, { Request, Response } from 'express'
import ShoppingCartController from '../controllers/ShoppingCartController'
import authMiddleware from '../middleware/authMiddleware'
import connection from '../utils/dbUtils'

const cartRouter = express.Router()
const shoppingCartController = new ShoppingCartController(connection)

cartRouter.post('/add', authMiddleware, (req: Request, res: Response) =>
  shoppingCartController.addToCart(req, res)
)
cartRouter.post('/remove', authMiddleware, (req: Request, res: Response) =>
  shoppingCartController.removeFromCart(req, res)
)
cartRouter.get('', authMiddleware, (req: Request, res: Response) =>
  shoppingCartController.getCart(req, res)
)

export default cartRouter
