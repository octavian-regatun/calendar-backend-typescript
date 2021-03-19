import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import config from './config';

mongoose
  .connect(config.MONGODB.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(console.error);

mongoose.connection.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:'),
);
