import express from 'express';
import { isAuthenticated } from '../middleware/auth';
import { auth } from './auth/auth';
import { events } from './events/events';
import { location } from './location/location';
import { users } from './users/users';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('server is working');
});

router.use('/auth', auth);
router.use('/users', isAuthenticated, users);
router.use('/events', isAuthenticated, events);
router.use('/location', isAuthenticated, location);

export { router as routes };
