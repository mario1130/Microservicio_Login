import pool from '../configuration/configPostgre.js';

class UserTag {

  static fields = ['id', 'tag_id', 'user_id', 'status'];

  // Buscar un usuario por correo electrónico
  static async getTagsByUserId(id) {
    const query = 'SELECT * FROM kreator."user_tag" WHERE user_id = $1 and status = 1'; // Esquema incluido
    const values = [id];
    const { rows } = await pool.query(query, values); // Usamos parametrización para evitar inyección SQL

    return rows || null; // Retorna el primer usuario encontrado o null si no existe
  }

}

export default UserTag;
