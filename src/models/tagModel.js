import pool from '../configuration/configPostgre.js';

class Tag {

  static fields = ['id', 'name', 'status', 'last_update'];



  static async getTagsByUserId(id) {
    try {
      const query = `SELECT * 
                      FROM kreator.tag t
                      JOIN kreator.user_tag ut on ut.tag_id = t.id
           WHERE t.status = 1 AND ut.status = 1 AND ut.user_id = $1 
           ORDER BY t.name asc`;

      const values = [
        id
      ];

      const { rows } = await pool.query(query, values);
      return rows;

    } catch (error) {
      throw new Error(`Error al obtener el tag: ${error.message}`);
    }
  }
}


export default Tag;
