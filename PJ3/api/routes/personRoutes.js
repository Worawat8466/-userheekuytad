const express = require('express');
const personController = require('../controllers/personController');

const router = express.Router();

// Person routes
router.get('/', personController.getAllPersons);
router.get('/active', personController.getActivePersons);
router.get('/:id', personController.getPersonById);
router.post('/', personController.createPerson);
router.put('/:id', personController.updatePerson);
router.delete('/:id', personController.deletePerson);

// Additional person utility routes
router.get('/next-id/generate', personController.getNextPersonId);
router.get('/department/:deptId/persons', personController.getPersonsByDepartment);
router.get('/rank/:rankId/persons', personController.getPersonsByRank);

module.exports = router;