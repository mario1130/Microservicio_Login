import pool from '../configuration/configPostgre.js';
import Auth from '../controllers/authController.js';


class User {

  static fields = ['id', 'name', 'mail', 'password', 'role'];


  // Buscar un usuario por correo electrónico
  static async getUserByEmail(mail) {
    const query = 'SELECT * FROM kreator."user" WHERE mail = $1' +
      ' ORDER BY status desc, last_update desc;'; // Esquema incluido
    const values = [mail];
    const { rows } = await pool.query(query, values); // Usamos parametrización para evitar inyección SQL

    rows[0].last_login = await Auth.getLastLogin(rows[0].mail);
    return rows[0] || null; // Retorna el primer usuario encontrado o null si no existe
  }



  static async insertUser(data) {
    try {
      const query = `
            INSERT INTO kreator."user" (id, name, last_name, mail, rating, rol_id, register_date, last_update)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
      const values = [
        data.id,
        data.name,
        data.last_name,
        data.mail,
        data.rating,
        data.rol_id,
        data.register_date,
        data.last_update
      ];

      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('Error al insertar usuario en la base de datos:', error);
      throw error;
    }
  }

  static async updateUser(data) {
    try {
      const query = `
            UPDATE kreator."user"
      SET
          name = $1,
          last_name = $2,
          mail = $3,
          rating = $4,
          rol_id = $5,
          register_date = $6,
          last_update = $7
      WHERE
          id = $8
      RETURNING *;
        `;
      const values = [
        data.name,
        data.last_name,
        data.mail,
        data.rating,
        data.rol_id,
        data.register_date,
        data.last_update,
        data.id
      ];


      const { rows } = await pool.query(query, values);
      if (rows.length === 0) {
        throw new Error(`El usuario con id ${data.id} no existe en la base de datos.`);
      }
      return rows[0];
    } catch (error) {
      console.error('Error al actualizar el usuario en la base de datos:', error);
      throw error;
    }
  }






}
export default User;