import { Request, Response } from 'express'
import { Connection } from 'mysql'
import UserModel from '../models/UserModel'

class UserController {
  private readonly model: UserModel

  constructor(connection: Connection) {
    this.model = new UserModel(connection)
  }

  public async register(req: Request, res: Response) {
    const { username, password } = req.body
    try {
      await this.model.handleRegistration(username, password)
      res.status(201).json({ message: 'User created successfully' })
    } catch (error: any) {
      res.status(500).json({ message: 'Error creating user: ' + error.message })
    }
  }
  public async login(req: Request, res: Response) {
    const { username, password } = req.body
    this.model.getUser(username)
    try {
      await this.model.handleLogin(username, password)
      const token = await this.model.generateToken(username)
      res.status(200).json({ message: 'Login successful', token })
    } catch (error: any) {
      res.status(500).json({ message: 'Error logging in: ' + error.message })
    }
  }
}

export default UserController
