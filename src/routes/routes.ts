import express from 'express';
import { isAuthenticated } from '../middleware/auth';
import { google } from './auth/google';
import { events } from './events/events';
import { friendships } from './friendships/friendships';
import { location } from './location/location';
import { users } from './users/users';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('server is working');
});

router.use('/auth/google', google);
router.use('/users', isAuthenticated, users);
router.use('/events', isAuthenticated, events);
router.use('/location', isAuthenticated, location);
router.use('/friendships', isAuthenticated, friendships);

export { router as routes };
