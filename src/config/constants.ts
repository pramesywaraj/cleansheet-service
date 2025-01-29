import { config } from 'dotenv';

config();

export const CONFIG = {
  jwt_secret: process.env.JWT_SECRET,
};
