import express from 'express';
import { isAuthenticated } from '../middleware/auth';
import { auth } from './auth/auth';
import { users } from './users/users';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('server is working');
});

router.use('/auth', auth);
router.use('/users', isAuthenticated, users);

export { router as routes };
