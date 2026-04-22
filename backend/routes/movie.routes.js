const express = require('express');
const router = express.Router();
const { getMovies, getShowsByMovie, getSeatsByShow } = require('../controllers/movie.controller');

router.get('/', getMovies);
router.get('/:movie_id/shows', getShowsByMovie);
router.get('/shows/:show_id/seats', getSeatsByShow);

module.exports = router;
