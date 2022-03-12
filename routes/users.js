const express = require('express');

const routes = express.Router();
const User = require('../models/user');
const router = require('./reviews');

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/register', async (req, res) => {
  res.send(req.body);
});

module.exports = router;
