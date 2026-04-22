const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const { bookTicket } = require('../controllers/booking.controller');

router.post('/book-ticket', auth, bookTicket);

module.exports = router;
