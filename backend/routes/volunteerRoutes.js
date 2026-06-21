const express = require('express');
const {
  createVolunteer,
  getVolunteers,
  getVolunteerStats,
  updateVolunteerStatus,
  deleteVolunteer,
  exportCSV,
  exportJSON,
} = require('../controllers/volunteerController');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Public Routes
router.post('/', createVolunteer);
router.get('/stats', getVolunteerStats);

// Protected Admin Routes
router.get('/', protect, getVolunteers);
router.put('/:id/status', protect, updateVolunteerStatus);
router.delete('/:id', protect, deleteVolunteer);
router.get('/export/csv', protect, exportCSV);
router.get('/export/json', protect, exportJSON);

module.exports = router;
