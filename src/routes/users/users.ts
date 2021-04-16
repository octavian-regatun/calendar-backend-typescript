import { DocumentType } from '@typegoose/typegoose';
import express from 'express';
import { User, UserModel, UserPublic } from '../../models/user.model';
import Filter from 'bad-words';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const user = await UserModel.findById(req.id);

    res.send(user);
  } catch {
    res.sendStatus(500);
  }
});

async function isUsernameValid(username: string): Promise<boolean> {
  const filter = new Filter();

  if (username.length <= 4 || username.length >= 16) return false;
  if (filter.isProfane(username)) return false;

  const foundUser = await UserModel.findOne({ username });

  if (foundUser) return false;

  return true;
}

router.patch('/', async (req, res) => {
  interface Body {
    username: string;
  }

  const { username }: Body = req.body;

  const thisUser = (await UserModel.findById(req.id)) as DocumentType<User>;

  if (isUsernameValid(username)) {
    thisUser.username = username;
  } else {
    return res.sendStatus(500);
  }

  await UserModel.findByIdAndUpdate(req.id, thisUser);

  return res.sendStatus(200);
});

export { router as users };
