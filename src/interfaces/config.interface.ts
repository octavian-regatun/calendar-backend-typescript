interface Config {
  PORT: number;
  GOOGLE: {
    CLIENT_ID: string;
  };
  MONGODB: {
    URI: string;
  };
  JWT_SECRET: string;
}

export default Config;
