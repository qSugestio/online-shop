import express, { Request, Response } from 'express'
import UserController from '../controllers/UserController'
import connection from '../utils/dbUtils'

const authRouter = express.Router()
const userController = new UserController(connection)

authRouter.post('/register', (req: Request, res: Response) =>
  userController.register(req, res)
)
authRouter.post('/login', (req: any, res: Response) =>
  userController.login(req, res)
)

export default authRouter
