const express = require('express');
const router = express.Router();
const entriesController = require('../controllers/entriesController');

// Get all entries
router.get('/getdata1', entriesController.getAllEntries);

// Create new entry
router.post('/create', entriesController.createEntry);

// Update entry visibility
router.post('/verify', entriesController.updateVisibility);

// Update manager signature
router.post('/update-signature', entriesController.updateManagerSignature);

// Get single entry by ID
router.get('/:id', entriesController.getEntryById);

module.exports = router; 