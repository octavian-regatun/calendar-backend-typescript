import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import JWTPayload from '../interfaces/jwtPayload.interface';

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const bearerHeader = req.headers.authorization;

  if (bearerHeader) {
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];

    jwt.verify(token, config.JWT_SECRET, (error, decoded) => {
      if (error) {
        res.sendStatus(403);
      } else {
        const { id } = decoded as JWTPayload;

        req.id = id;

        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
}
