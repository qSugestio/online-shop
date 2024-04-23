import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { Connection } from 'mysql'
import DatabaseUtils from './DatabaseUtils'
dotenv.config()

class UserModel {
  private db: DatabaseUtils
  constructor(connection: Connection) {
    this.db = new DatabaseUtils(connection)
  }

  public async generateToken(username: string) {
    const { id, role } = (await this.getUser(username)) as any
    const userData = { username, id, role }
    return jwt.sign(userData, process.env.SECRET_KEY as string, {
      expiresIn: '1h',
    })
  }

  public async verifyToken(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.SECRET_KEY as string, (err, decoded) => {
        if (err) reject('Неверный токен авторизации')
        else resolve(decoded)
      })
    })
  }

  async getUser(username: string): Promise<any> {
    const query = 'SELECT id, role FROM users WHERE BINARY username = ?'
    const user: any = await this.db.executeQuery(query, username)
    return user[0]
  }

  async checkUserExistence(username: string) {
    const query = 'SELECT * FROM users WHERE BINARY username = ?'
    const user = await this.db.executeQuery(query, username)
    if (user.length === 0) return false
    else return true
  }

  async hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) =>
      bcrypt.hash(password, 10, (err: any, hash: any) => {
        if (err) reject(err)
        else resolve(hash)
      })
    )
  }

  async registerUser(username: string, hashedPassword: string) {
    const query =
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)'
    const result = await this.db.executeQuery(query, [
      username,
      hashedPassword,
      'USER',
    ])
    return result
  }

  async handleRegistration(username: string, password: string) {
    const userExists = await this.checkUserExistence(username)
    if (!userExists) {
      const hashedPassword = (await this.hashPassword(password)) as string
      await this.registerUser(username, hashedPassword)
    } else {
      throw new Error('User is exists')
    }
  }

  private async comparePasswords(
    password: string,
    storedHash: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, storedHash)
  }
  async handleLogin(username: string, password: string) {
    const userExists = await this.checkUserExistence(username)
    if (userExists) {
      const query = 'SELECT password FROM users WHERE username = ?'
      const hashStored = await this.db.executeQuery(query, username)

      const comparisonResult = await this.comparePasswords(
        password,
        hashStored[0].password
      )
      if (!comparisonResult) throw new Error('password is')
    } else {
      throw new Error('user not exists')
    }
  }
}

export default UserModel
