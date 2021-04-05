import { NextFunction, Request, Response } from 'express';

export function sameId(
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void {
  const { id } = req.params;

  if (req.id !== id) {
    return res.status(500).send("user id doesn't match logged user id");
  }

  return next();
}
