const express = require('express');
const router = express.Router();
const {
  computeRoute,
  getGraph,
  submitReport,
  getReports,
  updateReport,
} = require('../controllers/routeController');

router.post('/route', computeRoute);
router.get('/graph', getGraph);
router.post('/report', submitReport);
router.get('/reports', getReports);
router.patch('/report/:id', updateReport);

module.exports = router;
