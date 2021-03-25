interface Config {
  PORT: number;
  GOOGLE: {
    CLIENT_ID: string;
  };
  MONGODB: {
    URI: string;
  };
  JWT_SECRET: string;
  HERE_API_KEY: string;
}

export default Config;
