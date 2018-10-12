const express = require('express');
const multer = require('multer');
const path = require('path');
const File = require('../models/File');
const Eatery = require('../models/Eatery');

const upload = multer({
  dest: 'public/upload',
  limit: {
    fieldNameSize: 300, // 200Byte
    fieldSize: 5e+6, // 3MB
  },
  storage: multer.diskStorage({
    destination(req, file, callback) {
      callback(null, 'static/upload');
    },
    filename(req, file, callback) {
      File.create({
        mimetype: file.mimetype || 'image/jpeg',
        filename: file.originalname,
        extName: path.extname(file.originalname) || '.jpg',
      }, (err, $file) => {
        callback(null, $file._id.toString() + $file.extName);
      });
    },
  }),
});

const router = express.Router();

// 로그인 정보가 필요할 때 사용.
function authorization({ isAdminOnly = false } = {}) {
  return (req, res, next) => {
    const { user } = req;
    if (!user) {
      res.status(401)
        .json({ error: 'Unauthorized' });
      return;
    }
    if (isAdminOnly && !user.isAdmin) {
      res.status(401)
        .json({ error: 'Unauthorized' });
      return;
    }
    next();
  };
}

function api(server) {
  const port = process.env.PORT || 8000;
  const dev = process.env.NODE_ENV !== 'production';
  const ROOT_URL = dev ? `http://localhost:${port}` : `${process.env.PROD_URL}`;
  // 음식점 목록
  router.get('/', async (req, res) => {
    try {
      const results = await Eatery.list();
      res.json(results);
    } catch (err) {
      res.json({ error: err.message || err.toString() });
    }
  });
  // 음식점 검색
  router.get('/search', async (req, res) => {
    try {
      const results = await Eatery.search(req.query.q);
      res.json(results);
    } catch (err) {
      res.json({ error: err.message || err.toString() });
    }
  });
  // 태그목록
  router.get('/tags', async (req, res) => {
    try {
      const results = await Eatery.tags();
      res.json(results);
    } catch (err) {
      res.json({ error: err.message || err.toString() });
    }
  });
  // 음식점 등록
  router.post('/', authorization(), upload.array('images', 12), async (req, res) => {
    try {
      const {
        name, description, tags, imageUrls,
      } = req.body;
      const photos = req.files.map(file => path.join('static', 'upload', file.filename))
        .concat(imageUrls || []);
      const result = await Eatery.add({
        name,
        description,
        tags,
        photos,
      });
      res.json(result);
    } catch (err) {
      res.json({ error: err.message || err.toString() });
    }
  });
  // 음식점 수정
  router.put('/:id', authorization(), async (req, res) => {
    try {
      const result = await Eatery.edit(req.params.id, req.body);
      res.json(result);
    } catch (err) {
      res.json({ error: err.message || err.toString() });
    }
  });
  // 음식점 삭제
  router.delete('/:id', authorization({ isAdminOnly: true }), async (req, res) => {
    try {
      const result = Eatery.del(req.params.id);
      res.json(result);
    } catch (err) {
      res.json({ error: err.message || err.toString() });
    }
  });

  server.use('/api/eatery', router);
}

module.exports = api;
