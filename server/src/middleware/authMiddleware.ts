import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]

  if (!token)
    return res.status(403).json({ message: 'Отсутствует токен авторизации' })

  jwt.verify(
    token,
    process.env.SECRET_KEY as string,
    (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: 'Неверный токен авторизации' })
      }
      req.body.role = decoded.role
      req.body.username = decoded.username
      req.body.id = decoded.id
      next()
    }
  )
}

export default authMiddleware
