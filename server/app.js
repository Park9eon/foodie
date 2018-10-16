const express = require('express');
const session = require('express-session');
const compression = require('compression');
const mongoSessionStore = require('connect-mongo');
const next = require('next');
const path = require('path');
const mongoose = require('mongoose');
const helmet = require('helmet');
const auth = require('./google');
const api = require('./api');

const logger = require('./logs');

require('dotenv')
  .config();

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 8000;
const ROOT_URL = dev ? `http://localhost:${port}` : `${process.env.PROD_URL}`;

const MONGO_URL = dev ? process.env.MONGO_URL_TEST : process.env.MONGO_URL;

mongoose.connect(MONGO_URL, { useNewUrlParser: true });

const sessionSecret = process.env.SESSION_SECRET;

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();

    server.use(helmet());
    server.use(compression());
    server.use(express.json());

    server.get('/_next/*', (req, res) => {
      handle(req, res);
    });

    server.get('/static/*', (req, res) => {
      handle(req, res);
    });

    const MongoStore = mongoSessionStore(session);
    const sess = {
      name: 'foodie.sid',
      secret: sessionSecret,
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 14 * 24 * 60 * 60, // save session 14 days
      }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 14 * 24 * 60 * 60 * 1000, // expires in 14 days
      },
    };

    if (!dev) {
      server.set('trust proxy', 1); // trust first proxy
      sess.cookie.secure = true; // serve secure cookies
    }

    server.use(session(sess));

    auth({
      server,
      ROOT_URL,
    });

    api(server);

    server.get('/review/:id', (req, res) => {
      const { id } = req.params;
      if (id) {
        app.render(req, res, '/review', { id });
      } else {
        res.redirect('/');
      }
    });

    server.get('*', (req, res) => {
      handle(req, res);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      logger.info(`> Ready on ${ROOT_URL}`);
    });
  });
