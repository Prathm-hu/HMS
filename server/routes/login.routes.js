const express = require('express');
const userRouter = require('../controllers/user.controller');

const router = express.Router();

router.get('/login',userRouter);

module.exports = router;