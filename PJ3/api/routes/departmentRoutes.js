const express = require('express');
const departmentController = require('../controllers/departmentController');

const router = express.Router();

// Department routes
router.get('/', departmentController.getAllDepartments);
router.get('/active', departmentController.getActiveDepartments);
router.get('/:id', departmentController.getDepartmentById);
router.post('/', departmentController.createDepartment);
router.put('/:id', departmentController.updateDepartment);
router.delete('/:id', departmentController.deleteDepartment);

// Additional department utility routes
router.get('/:id/persons', departmentController.getDepartmentPersons);

module.exports = router;