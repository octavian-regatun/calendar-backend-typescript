import { DocumentType } from '@typegoose/typegoose';
import express from 'express';
import { Console } from 'node:console';
import { sameId } from '../../middleware/sameId';
import { User, UserModel, UserPublic } from '../../models/user.model';

const router = express.Router();

router.get('/:id', sameId, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findById(req.id);

    res.send(user);
  } catch {
    res.sendStatus(500);
  }
});

router.get('/', async (req, res) => {
  const usersFound = await UserModel.find();

  const users: UserPublic[] = [];

  for (const userFound of usersFound) {
    const user: UserPublic = {
      _id: userFound._id,
      firstName: userFound.firstName,
      lastName: userFound.lastName,
      email: userFound.email,
      gender: userFound.gender,
    };

    users.push(user);
  }

  res.send(users);
});

export { router as users };
