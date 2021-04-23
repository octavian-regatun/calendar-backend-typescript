import { DocumentType } from '@typegoose/typegoose';
import Filter from 'bad-words';
import express from 'express';
import PublicUser from '../../interfaces/publicUser';
import { User, UserModel } from '../../models/user.model';

const router = express.Router();

router.get('/all', async (req, res) => {
  const publicInfoUsers: { _id: string; username: string }[] = [];

  try {
    const users = await UserModel.find();

    for (const user of users) {
      publicInfoUsers.push({ _id: user._id, username: user.username });
    }

    return res.send(publicInfoUsers);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const user = UserModel.findById(id);

  res.send({} as PublicUser);
});

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
