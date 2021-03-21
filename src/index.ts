import dotenv from 'dotenv';
dotenv.config();
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import config from './config';
import { routes } from './routes/routes';
import path from 'path';

(async (): Promise<void> => {
  await import('./database');

  const app = express();

  app.use(cors());

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  if (process.env.NODE_ENV === 'production') {
    app.use(
      express.static(path.join(__dirname, process.env.CLIENT_PATH || '')),
    );

    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
      res.sendFile(
        path.join(__dirname, process.env.CLIENT_PATH || '', 'index.html'),
      );
    });
  }

  app.use('/api', routes);

  app.listen(config.PORT, () => {
    console.log(`Server running on port: ${config.PORT}`);
  });
})();
