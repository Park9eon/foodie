const express = require('express');
const Eatery = require('../models/Eatery');

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
  // 음식점 목록
  router.get('/', async (req, res) => {
    try {
      const results = Eatery.list();
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
  router.post('/', authorization(), async (req, res) => {
    try {
      const result = await Eatery.add(req.body);
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

  server.use('/api', router);
}

module.exports = api;
