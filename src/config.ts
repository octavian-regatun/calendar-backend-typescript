import Config from './interfaces/config.interface';

const config: Config = {
  PORT: parseInt(process.env.PORT as string) || 8080,
  GOOGLE: {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
  },
  MONGODB: {
    URI: `mongodb+srv://${process.env.MONGODB_USER as string}:${
      process.env.MONGODB_PASSWORD as string
    }@main.bcluj.mongodb.net/main?retryWrites=true&w=majority`,
  },
  JWT_SECRET: process.env.JWT_SECRET as string,
  HERE_API_KEY: process.env.HERE_API_KEY as string,
};

export default config;
