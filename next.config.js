require('dotenv').config();

module.exports = {
  publicRuntimeConfig: {
    NODE_ENV: process.env.NODE_ENV,
    PROD_URL: process.env.PROD_URL,
    PORT: process.env.PORT,
    GOOGLE_MAP_KEY: process.env.GOOGLE_MAP_KEY,
  },
};
