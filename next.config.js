require('dotenv').config();

module.exports = {
  publicRuntimeConfig: {
    NODE_ENV: process.env.NODE_ENV,
    PROD_URL: process.env.PROD_URL,
    PORT: process.env.PORT,
    GA_TRACKING_ID: process.env.GA_TRACKING_ID,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  },
};
