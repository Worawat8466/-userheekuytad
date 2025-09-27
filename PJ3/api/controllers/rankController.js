const database = require('../config/database');
const { mockRanks } = require('../mockData');

class RankController {
  
  // GET /api/ranks - Get all ranks
  async getAllRanks(req, res) {
    try {
      const sql = `
        SELECT 
          RANKID,
          NAME,
          IS_ACTIVE
        FROM P_RANKS
        ORDER BY RANKID
      `;
      
      const result = await database.executeQuery(sql);
      
      res.json({
        success: true,
        data: result.rows,
        message: 'Ranks retrieved successfully'
      });
    } catch (error) {
      console.error('Database error, using mock data:', error.message);
      // Fallback to mock data when database is not available
      res.json({
        success: true,
        data: mockRanks,
        message: 'Ranks retrieved successfully (from mock data - database unavailable)'
      });
    }
  }

  // GET /api/ranks/active - Get active ranks only
  async getActiveRanks(req, res) {
    try {
      const sql = `
        SELECT 
          RANKID,
          NAME,
          IS_ACTIVE
        FROM P_RANKS
        WHERE IS_ACTIVE = 1
        ORDER BY NAME
      `;
      
      const result = await database.executeQuery(sql);
      
      res.json({
        success: true,
        data: result.rows,
        message: 'Active ranks retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching active ranks:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching active ranks',
        error: error.message
      });
    }
  }

  // GET /api/ranks/:id - Get rank by ID
  async getRankById(req, res) {
    try {
      const { id } = req.params;
      
      const sql = `
        SELECT 
          RANKID,
          NAME,
          IS_ACTIVE
        FROM P_RANKS
        WHERE RANKID = :id
      `;
      
      const result = await database.executeQuery(sql, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Rank not found'
        });
      }
      
      res.json({
        success: true,
        data: result.rows[0],
        message: 'Rank retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching rank:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching rank',
        error: error.message
      });
    }
  }

  // POST /api/ranks - Create new rank
  async createRank(req, res) {
    try {
      const {
        rankId,
        name,
        isActive = 1
      } = req.body;

      // Validate required fields
      if (!rankId || !name) {
        return res.status(400).json({
          success: false,
          message: 'RankId and name are required'
        });
      }

      // Check if rank ID already exists
      const checkSql = 'SELECT COUNT(*) as COUNT FROM P_RANKS WHERE RANKID = :rankId';
      const rankCheck = await database.executeQuery(checkSql, [rankId]);
      
      if (rankCheck.rows[0].COUNT > 0) {
        return res.status(409).json({
          success: false,
          message: 'Rank ID already exists'
        });
      }

      // Insert new rank
      const insertSql = `
        INSERT INTO P_RANKS (
          RANKID, NAME, IS_ACTIVE
        ) VALUES (
          :rankId, :name, :isActive
        )
      `;
      
      await database.executeQuery(insertSql, {
        rankId,
        name,
        isActive
      });

      res.status(201).json({
        success: true,
        message: 'Rank created successfully',
        data: { rankId }
      });
    } catch (error) {
      console.error('Error creating rank:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating rank',
        error: error.message
      });
    }
  }

  // PUT /api/ranks/:id - Update rank
  async updateRank(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        isActive
      } = req.body;

      // Check if rank exists
      const checkSql = 'SELECT RANKID FROM P_RANKS WHERE RANKID = :id';
      const rankExists = await database.executeQuery(checkSql, [id]);
      
      if (rankExists.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Rank not found'
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

      const updateSql = `UPDATE P_RANKS SET ${updateFields.join(', ')} WHERE RANKID = :id`;
      await database.executeQuery(updateSql, binds);

      res.json({
        success: true,
        message: 'Rank updated successfully'
      });
    } catch (error) {
      console.error('Error updating rank:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating rank',
        error: error.message
      });
    }
  }

  // DELETE /api/ranks/:id - Delete rank
  async deleteRank(req, res) {
    try {
      const { id } = req.params;

      // Check if rank exists
      const checkSql = 'SELECT RANKID FROM P_RANKS WHERE RANKID = :id';
      const rankExists = await database.executeQuery(checkSql, [id]);
      
      if (rankExists.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Rank not found'
        });
      }

      // Check if rank is being used by any person
      const usageCheckSql = 'SELECT COUNT(*) as COUNT FROM P_PERSONS WHERE RANKID = :id';
      const usageCheck = await database.executeQuery(usageCheckSql, [id]);
      
      if (usageCheck.rows[0].COUNT > 0) {
        return res.status(409).json({
          success: false,
          message: 'Cannot delete rank. It is being used by one or more persons.'
        });
      }

      // Delete rank
      const deleteSql = 'DELETE FROM P_RANKS WHERE RANKID = :id';
      await database.executeQuery(deleteSql, [id]);

      res.json({
        success: true,
        message: 'Rank deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting rank:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting rank',
        error: error.message
      });
    }
  }

  // GET /api/ranks/:id/persons - Get all persons with a specific rank
  async getRankPersons(req, res) {
    try {
      const { id } = req.params;
      
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
        WHERE p.RANKID = :id
        ORDER BY p.NAME
      `;
      
      const result = await database.executeQuery(sql, [id]);
      
      res.json({
        success: true,
        data: result.rows,
        message: 'Rank persons retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching rank persons:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching rank persons',
        error: error.message
      });
    }
  }
}

module.exports = new RankController();