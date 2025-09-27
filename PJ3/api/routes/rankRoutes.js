const express = require('express');
const rankController = require('../controllers/rankController');

const router = express.Router();

// Rank routes
router.get('/', rankController.getAllRanks);
router.get('/active', rankController.getActiveRanks);
router.get('/:id', rankController.getRankById);
router.post('/', rankController.createRank);
router.put('/:id', rankController.updateRank);
router.delete('/:id', rankController.deleteRank);

// Additional rank utility routes
router.get('/:id/persons', rankController.getRankPersons);

module.exports = router;