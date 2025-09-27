const database = require('../config/database');
const { mockPersons } = require('../mockData');

class PersonController {
  
  // GET /api/persons - Get all persons with department and rank info
  async getAllPersons(req, res) {
    try {
      const sql = `
        SELECT 
          p.PERSONID,
          p.NAME,
          p.USERNAME,
          p.PASSWORD,
          p.SYSTEMPERMIS,
          p.RANKID,
          p.DEPARTMENTID,
          p.IS_ACTIVE,
          r.NAME as RANK_NAME,
          d.NAME as DEPARTMENT_NAME
        FROM P_PERSONS p
        LEFT JOIN P_RANKS r ON p.RANKID = r.RANKID
        LEFT JOIN P_DEPARTMENTS d ON p.DEPARTMENTID = d.DEPARTMENTID
        ORDER BY p.PERSONID
      `;
      
      const result = await database.executeQuery(sql);
      
      res.json({
        success: true,
        data: result.rows,
        message: 'Persons retrieved successfully'
      });
    } catch (error) {
      console.error('Database error, using mock data:', error.message);
      // Fallback to mock data when database is not available
      res.json({
        success: true,
        data: mockPersons,
        message: 'Persons retrieved successfully (from mock data - database unavailable)'
      });
    }
  }

  // GET /api/persons/active - Get active persons only
  async getActivePersons(req, res) {
    try {
      const sql = `
        SELECT 
          p.PERSONID,
          p.NAME,
          p.USERNAME,
          p.PASSWORD,
          p.SYSTEMPERMIS,
          p.RANKID,
          p.DEPARTMENTID,
          p.IS_ACTIVE,
          r.NAME as RANK_NAME,
          d.NAME as DEPARTMENT_NAME
        FROM P_PERSONS p
        LEFT JOIN P_RANKS r ON p.RANKID = r.RANKID
        LEFT JOIN P_DEPARTMENTS d ON p.DEPARTMENTID = d.DEPARTMENTID
        WHERE p.IS_ACTIVE = 1
        ORDER BY p.PERSONID
      `;
      
      const result = await database.executeQuery(sql);
      
      res.json({
        success: true,
        data: result.rows,
        message: 'Active persons retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching active persons:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching active persons',
        error: error.message
      });
    }
  }

  // GET /api/persons/:id - Get person by ID
  async getPersonById(req, res) {
    try {
      const { id } = req.params;
      
      const sql = `
        SELECT 
          p.PERSONID,
          p.NAME,
          p.USERNAME,
          p.PASSWORD,
          p.SYSTEMPERMIS,
          p.RANKID,
          p.DEPARTMENTID,
          p.IS_ACTIVE,
          r.NAME as RANK_NAME,
          d.NAME as DEPARTMENT_NAME
        FROM P_PERSONS p
        LEFT JOIN P_RANKS r ON p.RANKID = r.RANKID
        LEFT JOIN P_DEPARTMENTS d ON p.DEPARTMENTID = d.DEPARTMENTID
        WHERE p.PERSONID = :id
      `;
      
      const result = await database.executeQuery(sql, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Person not found'
        });
      }
      
      res.json({
        success: true,
        data: result.rows[0],
        message: 'Person retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching person:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching person',
        error: error.message
      });
    }
  }

  // POST /api/persons - Create new person
  async createPerson(req, res) {
    try {
      const {
        personId,
        name,
        username,
        password,
        systemPermis = 'U',
        rankId,
        departmentId,
        isActive = 1
      } = req.body;

      // Validate required fields
      if (!personId || !name || !username || !password) {
        return res.status(400).json({
          success: false,
          message: 'PersonId, name, username, and password are required'
        });
      }

      // Check if username already exists
      const checkUsernameSql = 'SELECT COUNT(*) as COUNT FROM P_PERSONS WHERE USERNAME = :username';
      const usernameCheck = await database.executeQuery(checkUsernameSql, [username]);
      
      if (usernameCheck.rows[0].COUNT > 0) {
        return res.status(409).json({
          success: false,
          message: 'Username already exists'
        });
      }

      // Insert new person
      const insertSql = `
        INSERT INTO P_PERSONS (
          PERSONID, NAME, USERNAME, PASSWORD, SYSTEMPERMIS, 
          RANKID, DEPARTMENTID, IS_ACTIVE
        ) VALUES (
          :personId, :name, :username, :password, :systemPermis,
          :rankId, :departmentId, :isActive
        )
      `;
      
      await database.executeQuery(insertSql, {
        personId,
        name,
        username,
        password,
        systemPermis,
        rankId: rankId || null,
        departmentId: departmentId || null,
        isActive
      });

      res.status(201).json({
        success: true,
        message: 'Person created successfully',
        data: { personId }
      });
    } catch (error) {
      console.error('Error creating person:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating person',
        error: error.message
      });
    }
  }

  // PUT /api/persons/:id - Update person
  async updatePerson(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        username,
        password,
        systemPermis,
        rankId,
        departmentId,
        isActive
      } = req.body;

      // Check if person exists
      const checkSql = 'SELECT PERSONID FROM P_PERSONS WHERE PERSONID = :id';
      const personExists = await database.executeQuery(checkSql, [id]);
      
      if (personExists.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Person not found'
        });
      }

      // Check if username already exists for other persons
      if (username) {
        const checkUsernameSql = 'SELECT COUNT(*) as COUNT FROM P_PERSONS WHERE USERNAME = :username AND PERSONID != :id';
        const usernameCheck = await database.executeQuery(checkUsernameSql, [username, id]);
        
        if (usernameCheck.rows[0].COUNT > 0) {
          return res.status(409).json({
            success: false,
            message: 'Username already exists'
          });
        }
      }

      // Build dynamic update query
      const updateFields = [];
      const binds = { id };

      if (name !== undefined) {
        updateFields.push('NAME = :name');
        binds.name = name;
      }
      if (username !== undefined) {
        updateFields.push('USERNAME = :username');
        binds.username = username;
      }
      if (password !== undefined) {
        updateFields.push('PASSWORD = :password');
        binds.password = password;
      }
      if (systemPermis !== undefined) {
        updateFields.push('SYSTEMPERMIS = :systemPermis');
        binds.systemPermis = systemPermis;
      }
      if (rankId !== undefined) {
        updateFields.push('RANKID = :rankId');
        binds.rankId = rankId || null;
      }
      if (departmentId !== undefined) {
        updateFields.push('DEPARTMENTID = :departmentId');
        binds.departmentId = departmentId || null;
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

      const updateSql = `UPDATE P_PERSONS SET ${updateFields.join(', ')} WHERE PERSONID = :id`;
      await database.executeQuery(updateSql, binds);

      res.json({
        success: true,
        message: 'Person updated successfully'
      });
    } catch (error) {
      console.error('Error updating person:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating person',
        error: error.message
      });
    }
  }

  // DELETE /api/persons/:id - Delete person
  async deletePerson(req, res) {
    try {
      const { id } = req.params;

      // Check if person exists
      const checkSql = 'SELECT PERSONID FROM P_PERSONS WHERE PERSONID = :id';
      const personExists = await database.executeQuery(checkSql, [id]);
      
      if (personExists.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Person not found'
        });
      }

      // Delete person
      const deleteSql = 'DELETE FROM P_PERSONS WHERE PERSONID = :id';
      await database.executeQuery(deleteSql, [id]);

      res.json({
        success: true,
        message: 'Person deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting person:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting person',
        error: error.message
      });
    }
  }

  // GET /api/persons/next-id - Generate next person ID
  async getNextPersonId(req, res) {
    try {
      const sql = `
        SELECT 'P' || LPAD(NVL(MAX(TO_NUMBER(SUBSTR(PERSONID, 2))), 0) + 1, 9, '0') as NEXT_ID
        FROM P_PERSONS
        WHERE REGEXP_LIKE(PERSONID, '^P[0-9]{9}$')
      `;
      
      const result = await database.executeQuery(sql);
      
      res.json({
        success: true,
        data: {
          personId: result.rows[0].NEXT_ID
        },
        message: 'Next person ID generated successfully'
      });
    } catch (error) {
      console.error('Error generating next person ID:', error);
      res.status(500).json({
        success: false,
        message: 'Error generating next person ID',
        error: error.message
      });
    }
  }

  // GET /api/persons/department/:deptId/persons - Get persons by department
  async getPersonsByDepartment(req, res) {
    try {
      const { deptId } = req.params;
      
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
        WHERE p.DEPARTMENTID = :deptId
        ORDER BY p.NAME
      `;
      
      const result = await database.executeQuery(sql, [deptId]);
      
      res.json({
        success: true,
        data: result.rows,
        message: 'Persons by department retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching persons by department:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching persons by department',
        error: error.message
      });
    }
  }

  // GET /api/persons/rank/:rankId/persons - Get persons by rank
  async getPersonsByRank(req, res) {
    try {
      const { rankId } = req.params;
      
      const sql = `
        SELECT 
          p.PERSONID,
          p.NAME,
          p.USERNAME,
          p.SYSTEMPERMIS,
          p.IS_ACTIVE,
          d.NAME as DEPARTMENT_NAME
        FROM P_PERSONS p
        LEFT JOIN P_DEPARTMENTS d ON p.DEPARTMENTID = d.DEPARTMENTID
        WHERE p.RANKID = :rankId
        ORDER BY p.NAME
      `;
      
      const result = await database.executeQuery(sql, [rankId]);
      
      res.json({
        success: true,
        data: result.rows,
        message: 'Persons by rank retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching persons by rank:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching persons by rank',
        error: error.message
      });
    }
  }
}

module.exports = new PersonController();