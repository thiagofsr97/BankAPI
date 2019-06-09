import dotenv from 'dotenv';
import path from 'path';

const env = function enviroment() {
  const environmentType = /^dev$|^production$/;

  if (environmentType.test(process.env.NODE_ENV)) {
    return path.join(__dirname, `.env.${process.env.NODE_ENV}`);
  }

  return path.join(__dirname, '.env.production');
};

const envVariables = dotenv.config({ path: env() });


export default envVariables.parsed;
