import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import config from './config';
import { routes } from './routes/routes';

(async (): Promise<void> => {
  await import('./database');

  const app = express();

  app.use(cors());

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use('/', routes);

  app.listen(config.PORT, () => {
    console.log(`Server running on port: ${config.PORT}`);
  });
})();
