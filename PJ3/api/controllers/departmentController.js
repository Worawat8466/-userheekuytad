const database = require('../config/database');

class DepartmentController {
  
  // GET /api/departments - Get all departments
  async getAllDepartments(req, res) {
    try {
      const sql = `
        SELECT 
          DEPARTMENTID,
          NAME,
          IS_ACTIVE
        FROM P_DEPARTMENTS
        ORDER BY DEPARTMENTID
      `;
      
      const result = await database.executeQuery(sql);
      
      res.json({
        success: true,
        data: result.rows,
        message: 'Departments retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching departments from database:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching departments from database',
        error: error.message
      });
    }
  }

  // GET /api/departments/active - Get active departments only
  async getActiveDepartments(req, res) {
    try {
      const sql = `
        SELECT 
          DEPARTMENTID,
          NAME,
          IS_ACTIVE
        FROM P_DEPARTMENTS
        WHERE IS_ACTIVE = 1
        ORDER BY NAME
      `;
      
      const result = await database.executeQuery(sql);
      
      res.json({
        success: true,
        data: result.rows,
        message: 'Active departments retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching active departments:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching active departments',
        error: error.message
      });
    }
  }

  // GET /api/departments/:id - Get department by ID
  async getDepartmentById(req, res) {
    try {
      const { id } = req.params;
      
      const sql = `
        SELECT 
          DEPARTMENTID,
          NAME,
          IS_ACTIVE
        FROM P_DEPARTMENTS
        WHERE DEPARTMENTID = :id
      `;
      
      const result = await database.executeQuery(sql, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Department not found'
        });
      }
      
      res.json({
        success: true,
        data: result.rows[0],
        message: 'Department retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching department:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching department',
        error: error.message
      });
    }
  }

  // POST /api/departments - Create new department
  async createDepartment(req, res) {
    try {
      const {
        departmentId,
        name,
        isActive = 1
      } = req.body;

      // Validate required fields
      if (!departmentId || !name) {
        return res.status(400).json({
          success: false,
          message: 'DepartmentId and name are required'
        });
      }

      // Check if department ID already exists
      const checkSql = 'SELECT COUNT(*) as COUNT FROM P_DEPARTMENTS WHERE DEPARTMENTID = :departmentId';
      const departmentCheck = await database.executeQuery(checkSql, [departmentId]);
      
      if (departmentCheck.rows[0].COUNT > 0) {
        return res.status(409).json({
          success: false,
          message: 'Department ID already exists'
        });
      }

      // Insert new department
      const insertSql = `
        INSERT INTO P_DEPARTMENTS (
          DEPARTMENTID, NAME, IS_ACTIVE
        ) VALUES (
          :departmentId, :name, :isActive
        )
      `;
      
      await database.executeQuery(insertSql, {
        departmentId,
        name,
        isActive
      });

      res.status(201).json({
        success: true,
        message: 'Department created successfully',
        data: { departmentId }
      });
    } catch (error) {
      console.error('Error creating department:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating department',
        error: error.message
      });
    }
  }

  // PUT /api/departments/:id - Update department
  async updateDepartment(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        isActive
      } = req.body;

      // Check if department exists
      const checkSql = 'SELECT DEPARTMENTID FROM P_DEPARTMENTS WHERE DEPARTMENTID = :id';
      const departmentExists = await database.executeQuery(checkSql, [id]);
      
      if (departmentExists.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Department not found'
        });
      }

      // Build dynamic update query
      const updateFields = [];
      const binds = { id };

      if (name !== undefined) {
        updateFields.push('NAME = :name');
        binds.name = name;
      }
      if (isActive !== undefined) {
        updateFields.push('IS_ACTIVE = :isActive');
        binds.isActive = isActive;
      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No fields to update'
        });
      }

      const updateSql = `UPDATE P_DEPARTMENTS SET ${updateFields.join(', ')} WHERE DEPARTMENTID = :id`;
      await database.executeQuery(updateSql, binds);

      res.json({
        success: true,
        message: 'Department updated successfully'
      });
    } catch (error) {
      console.error('Error updating department:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating department',
        error: error.message
      });
    }
  }

  // DELETE /api/departments/:id - Delete department
  async deleteDepartment(req, res) {
    try {
      const { id } = req.params;

      // Check if department exists
      const checkSql = 'SELECT DEPARTMENTID FROM P_DEPARTMENTS WHERE DEPARTMENTID = :id';
      const departmentExists = await database.executeQuery(checkSql, [id]);
      
      if (departmentExists.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Department not found'
        });
      }

      // Check if department is being used by any person
      const usageCheckSql = 'SELECT COUNT(*) as COUNT FROM P_PERSONS WHERE DEPARTMENTID = :id';
      const usageCheck = await database.executeQuery(usageCheckSql, [id]);
      
      if (usageCheck.rows[0].COUNT > 0) {
        return res.status(409).json({
          success: false,
          message: 'Cannot delete department. It is being used by one or more persons.'
        });
      }

      // Delete department
      const deleteSql = 'DELETE FROM P_DEPARTMENTS WHERE DEPARTMENTID = :id';
      await database.executeQuery(deleteSql, [id]);

      res.json({
        success: true,
        message: 'Department deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting department:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting department',
        error: error.message
      });
    }
  }

  // GET /api/departments/:id/persons - Get all persons in a department
  async getDepartmentPersons(req, res) {
    try {
      const { id } = req.params;
      
      const sql = `
        SELECT 
          p.PERSONID,
          p.NAME,
          p.USERNAME,
          p.SYSTEMPERMIS,
          p.IS_ACTIVE,
          r.NAME as RANK_NAME
        FROM P_PERSONS p
        LEFT JOIN P_RANKS r ON p.RANKID = r.RANKID
        WHERE p.DEPARTMENTID = :id
        ORDER BY p.NAME
      `;
      
      const result = await database.executeQuery(sql, [id]);
      
      res.json({
        success: true,
        data: result.rows,
        message: 'Department persons retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching department persons:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching department persons',
        error: error.message
      });
    }
  }
}

module.exports = new DepartmentController();