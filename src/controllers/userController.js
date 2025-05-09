import User from '../models/userModel.js';
import UserTag from '../models/userTagModel.js';
import Tag from '../models/tagModel.js';
import pool from '../configuration/configPostgre.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json(
      users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      message: 'Error al obtener usuarios',
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const users = await User.getUserById(req.body.id);

    if (!users || users.length === 0) {
      return res.status(204).json({ message: 'No se encontraron usuarios con ID' });
    }
    res.status(200).json(
      users
    );
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      message: 'Error al obtener usuarios',
    });
  }
};

// export const getUserByEmail = async (req, res) => {
//   try {
//     const { mail } = req.body
//     const users = await User.getUserByEmail(mail);
//     if (!users || users.length === 0) {
//       return res.status(204).json({ message: 'No se encontraron usuarios para el mail' });
//     }
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({
//       message: 'Error al obtener usuarios',
//     });
//   }
// };

export const getUserByEmail = async (req, res) => {
  try {
    const { mail } = req.validatedData;

    if (!mail) {
      return res.status(400).json({ message: 'El correo es obligatorio.' });
    }

    const user = await User.getUserByEmail(mail);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error en getUserByEmail:', error.message);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const getAllAuthors = async (req, res) => {
  try {
    const users = await User.getAllAuthors();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      message: 'Error al obtener usuarios',
    });
  }
};

export const getAllEditors = async (req, res) => {
  try {
    const users = await User.getAllEditors();
    res.status(200).json(
      users
    );
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      message: 'Error al obtener usuarios'
    });
  }
};

export const getAllAuthorsSelect = async (req, res) => {
  try {
    const users = await User.getAllAuthorsSelect();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      message: 'Error al obtener usuarios',
    });
  }
};

export const getAllEditorsSelect = async (req, res) => {
  try {
    const users = await User.getAllEditorsSelect();
    res.status(200).json(
      users
    );
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      message: 'Error al obtener usuarios'
    });
  }
};

export const getAllUsersWithRol = async (req, res) => {
  try {
    const users = await User.getAllUserWithRol();
    res.status(200).json(
      users
    );
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      message: 'Error al obtener usuarios'
    });
  }
};

export const getAuthorById = async (req, res) => {
  try {
    let users = await User.getAuthorById(req.body);
    if (!users || users.length === 0) {
      return res.status(204).json({ message: 'No se encontraron usuarios para los filtros' });
    } else {
      return res.status(200).json(users);
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener usuarios',
    });
  }
}

export const getUserFiltered = async (req, res) => {
  try {
    let users = await User.getUserFiltered(req.query);
    if (!users || users.length === 0) {
      return res.status(204).json({ message: 'No se encontraron usuarios para los filtros' });
    } else {
      return res.status(200).json(users);
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener usuarios',
    });
  }
}

export const insertUser = async (req, res) => {
  try {
    const user = await User.insertUser(req);
    res.status(200).json({ user_id: user });
  } catch (error) {
    console.error('Error al insertar usuarios:', error);
    res.status(500).json({
      message: 'Error al insertar usuarios',
    });
  }
}

export const updateUser = async (req, res) => {
  try {
    const user = await User.updateUser(req);
    res.status(200).json({ user_id: user });
  } catch (error) {
    console.error('Error al actualizar usuarios:', error);
    res.status(500).json({
      message: 'Error al actualizar usuarios',
    });
  }
};

export const changeUserStatus = async (req, res) => {
  try {
    const user = await User.changeUserStatus(req);
    res.status(200).json({ user_id: user });
  } catch (error) {
    console.error('Error al cambiar status de usuarios:', error);
    res.status(500).json({
      message: 'Error al cambiar status de usuarios',
    });
  }
};

export const getAuthorFiltered = async (req, res) => {
  try {
    const users = await User.getAuthorFiltered(req.body);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener autores:', error);
    res.status(500).json({
      message: 'Error al obtener autores',
    });
  }
};

export const getEditorFiltered = async (req, res) => {
  try {
    const users = await User.getEditorFiltered(req.body);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener editores:', error);
    res.status(500).json({
      message: 'Error al obtener editores',
    });
  }
};

export const insertEditor = async (req, res) => {
  try {
    const user = await User.insertEditor(req);
    res.status(200).json({ user_id: user });
  } catch (error) {
    console.error('Error al insertar editor:', error);
    res.status(500).json({
      message: 'Error al insertar editor',
    });
  }
}

export const insertAuthor = async (req, res) => {
  try {
    const user_id = await User.insertAuthor(req);
    const data = req.body;
    //Tenemos que insertar las tag      
    if (data.tags != undefined) {
      data.tags = JSON.parse(data.tags);
      for (const entry of data.tags) {
        //Primero compruebo si es nueva etiqueta
        if (entry.id != "") { //Significa que esa tag existe 
          //Como la tag existe y el usuario es nuevo insertamos en la tabla user_tag la relacion
          try {
            await UserTag.insertUserTag({ "tag_id": entry.id, "user_id": user_id })
          } catch (error) {
            console.error(`Error al insertar la etiqueta al usuario`, error);
          }
        } else {
          //Como la tag es nueva debemos insertarla antes de relacionarla
          try {
            let tag_id = await Tag.insertTag({ "name": entry.name });
            //Despues añadiremos la relacion
            await UserTag.insertUserTag({ "tag_id": tag_id, "user_id": user_id })
          } catch (error) {
            console.error(`Error al insertar la etiqueta al usuario`, error);
          }
        }

      }

    }
    res.status(200).json({ user_id: user_id });
  } catch (error) {
    console.error('Error al insertar autor:', error);
    res.status(500).json({
      message: 'Error al insertar autor',
    });
  }
}
export const updateAuthor = async (req, res) => {

  const client = await pool.connect(); // Obtener un cliente para la transacción
  try {
    // Inicia la transacción
    await client.query('BEGIN');

    // Insertar el proyecto
    const id = await User.updateUser(req);
    if (!id || id === '') {
      return res.status(204).json("No se encontró el usuario");
    }

    //Insertar los autores y editores 
    let tagsBody = JSON.parse(req.body.tags);
    if (tagsBody) {

      const tags = await UserTag.getTagsByUserId(id);
      //Primero pongo a baja los que no deberian estar 
      for (const entry of tags) {
        const foundInTags = tagsBody.some(tag => tag.id === entry.tag_id);
        if (!foundInTags) {
          try {
            await UserTag.bajaUserTag({ tag_id: entry.tag_id, user_id: id }, client);
          } catch (error) {
            console.error(`Error al dar de baja el usuario ${entry.user_id}:`, error);
          }
        }
      }
      // Si no está, insertar el nuevo user_tag
      for (const tag of tagsBody) {
        const foundInDatabase = tags.some(entry => entry.tag_id === tag.id);
        if (!foundInDatabase) {
          try {
            if (tag.id != "") { //Significa que esa tag existe 
              //Como la tag existe y ya hemos comprobado que no la tiene, insertamos en la tabla user_tag la relacion
              try {
                await UserTag.insertUserTag({ "tag_id": tag.id, "user_id": id })
              } catch (error) {
                console.error(`Error al insertar la etiqueta al usuario`, error);
              }
            } else {
              //Como la tag es nueva debemos insertarla antes de relacionarla
              try {
                let tag_id = await Tag.insertTag({ "name": tag.name });
                //Despues añadiremos la relacion
                await UserTag.insertUserTag({ "tag_id": tag_id, "user_id": id })
              } catch (error) {
                console.error(`Error al insertar la etiqueta al usuario`, error);
              }
            }
          } catch (error) {
            console.error(`Error al insertar el autor`, error);
          }
        }
      }

    }
    // Si todo es exitoso, confirmar la transacción
    await client.query('COMMIT');
    res.status(200).json({ user_id: id });
  } catch (error) {
    // Revertir la transacción si algo falla
    await client.query('ROLLBACK');
    res.status(500).json({
      message: `Error al actualizar proyectos: ${error.message}`,
    });
  } finally {
    // Liberar el cliente
    client.release();
  }
}



export default {
  getAllUsers, getUserById, getUserByEmail, getAllAuthors,
  getAllEditors, getAllUsersWithRol, getUserFiltered,
  insertUser, updateUser, changeUserStatus, getAuthorFiltered, getEditorFiltered,
  insertAuthor, insertEditor, updateAuthor, getAuthorById, getAllAuthorsSelect, getAllEditorsSelect
}