import express from 'express';
import { UserModel } from '../../models/user.model';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const user = await UserModel.findById(req.id);

    res.send(user);
  } catch {
    res.sendStatus(500);
  }
});

export { router as users };
