export = {
  /**Queries para el manejo de codigos de verificacion */
  verification_codes: {
    /**Selecciona los codigos de verificacion existentes con status "PENDING" */
    getExistentCodes: 'SELECT code FROM code_verification WHERE status = $1',
    /** Se guarda un nuevo codigo de verificacion con status "PENDING"*/
    insertNewCode:
      'INSERT INTO code_verification(email, code, status, last_update) VALUES($1, $2, $3, NOW()) RETURNING verification_id',
    /** Se borra el codigo de la base de datos, invalidandolo*/
    invalidateCode: 'DELETE FROM code_verification WHERE verification_id = $1',
    /**Verifica que el codigo existe y tiene status "PENDING" */
    verifyCode:
      'SELECT verification_id, email, code FROM code_verification WHERE verification_id = $1 AND code = $2 AND status = $3',
    /**Cambia el status de un codigo verificado exitosamente de
     * "PENDING" a "COMPLETED"
     */
    setCompleted:
      'UPDATE code_verification SET status = $1, last_update = NOW() WHERE verification_id = $2',
  },
  /**Queries para insertar nueva informacion de usuarios */
  insertUser: {
    /**Inserta un nuevo usuario a la tabla y retorna la nueva ID*/
    new:
      'INSERT INTO users(name, email, phone, password, creation_date) VALUES($1, $2, $3, $4, NOW()) RETURNING user_id',
    /**Inserta nueva informacion a user_description vinculada al usuario de la ID indicada */
    description:
      'INSERT INTO user_description(user_id, last_name, gender, address, country, age, description, birth_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
    /**Añade una nueva habilidad a la lista perteneciente al usuario de la ID indicada */
    ability:
      'INSERT INTO user_abilities(user_id, name) VALUES($1, $2) RETURNING *',
    /**Añade una nueva descripcion de experiencia de trabajo a la lista del usuario
     * de la ID indicada
     */
    experience:
      'INSERT INTO user_experience(user_id, org_name, job_description, job_title, start_date, finish_date) VALUES($1, $2, $3, $4, $5, $6)',
    /**Registra un nuevo premio vinculado al usuario de la ID indicada */
    award:
      'INSERT INTO user_awards(user_id, title, description, given_by, date) VALUES($1, $2, $3, $4, $5)',
    /**Registra un nuevo proyecto vinculado al usuario de la ID indicada */
    project:
      'INSERT INTO user_projects(user_id, project_name, project_description, project_link) VALUES($1, $2, $3, $4)',
    /**Añade un nuevo registro de educacion al usuario de la ID indicada */
    education:
      'INSERT INTO user_education(user_id, entity_name, title, start_date, finish_date) VALUES($1, $2, $3, $4, $5)',
  },
  /**Queries para editar informacion existente de usuarios */
  setUser: {
    /**Se actualiza el campo avatar del usuario con la ID indicada*/
    avatar: 'UPDATE users SET avatar = $1 WHERE user_id = $2',
    /**Se actualiza la informacion de user_description pertenenciente al
     * usuario de la ID indicada */
    description:
      'UPDATE user_description SET description = $1, country = $2, age = $3, gender = $4, address = $5, last_name = $6, birth_date = $7 WHERE user_id = $8 RETURNING *',
    /**Edita la descripcion de experiencia de trabajo registrada con la ID dada */
    job:
      'UPDATE user_experience SET org_name = $1, job_title = $2, job_description = $3, start_date = $4, finish_date = $5 WHERE job_id = $6',
    /**Edita la descripcion de premio recibido por ID */
    award:
      'UPDATE user_awards SET title = $1, description = $2, given_by = $3, date = $4 WHERE award_id = $5',
    /**Edita el proyecto con la ID indicada */
    project:
      'UPDATE user_projects SET project_name = $1, project_description = $2, project_link = $3 WHERE project_id = $4',
    /**Edita el registro de educacion con la ID indicada */
    education:
      'UPDATE user_education SET entity_name = $1, title = $2, start_date = $3, finish_date = $4 WHERE education_id = $5',
    /**Cambia el nombre de un usuario */
    name: 'UPDATE users SET name = $1 WHERE user_id = $2',
  },
  /**Queries para el manejo de transacciones */
  transaction: {
    /**Empieza una transaccion */
    begin: 'BEGIN',
    /**Confirma una transaccion */
    commit: 'COMMIT',
    /**Cancela una transaccion */
    rollback: 'ROLLBACK',
  },
  /**Queries para leer informacion de usuarios */
  getUser: {
    /**Selecciona los credenciales de un usuario registrado
     * con el email indicado
     */
    credentials: 'SELECT user_id, name, password FROM users WHERE email = $1',
    /**Selecciona las filas que coincidan con el Email o numero telefonico
     * proporcionados
     */
    areCredentialsNew: 'SELECT * FROM users WHERE email = $1 OR phone = $2',
    /**Selecciona el avatar del usuario registrado con la ID indicada */
    avatar: 'SELECT avatar FROM users WHERE user_id = $1',
    /**Selecciona las abilidades añadidas por el usuario de la ID indicada */
    abilites: 'SELECT ability_id, name FROM user_abilities WHERE user_id = $1',
    /**Selecciona los premios añadidos por el usuario de la ID indicada  */
    awards:
      'SELECT award_id AS id, title AS name FROM user_awards WHERE user_id = $1',
    /**Selecciona la descripcion general (fecha de nacimiento, edad, pais de residencia, etc...)
     * añadida por el usuario de la ID indicada
     */
    description: 'SELECT * FROM user_description WHERE user_id = $1',
    /**Selecciona los registros de educacion añadidos por el usuario de la ID
     * indicada
     */
    titles:
      'SELECT education_id AS id, title AS name FROM user_education WHERE user_id = $1',
    /**Selecciona los registros de experiencia laboral añadidos por el usuario de la ID
     * indicada
     */
    experience:
      'SELECT job_id AS id, job_title AS name FROM user_experience WHERE user_id = $1',
    /**Selecciona los registros de proyectos añadidos por el usuario de la ID indicada */
    projects:
      'SELECT project_id AS id, project_name AS name FROM user_projects WHERE user_id = $1',
    /**Selecciona las recomendaciones recibidas por el usuario de la ID indicada */
    recommendations:
      'SELECT * FROM user_recommendations WHERE recommended_user = $1',
    /**Seleccion una descripcion completa de experiencia de trabajo por ID */
    job:
      'SELECT org_name AS Organization, job_description AS Description, job_title AS Title, start_date AS Start, finish_date AS End FROM user_experience WHERE job_id = $1',
    /**Seleccion una descripcion completa de premio recibido por ID  */
    award:
      'SELECT title, description, given_by AS by, date FROM user_awards WHERE award_id = $1',
    /**Selecciona la descripcion completa de un proyecto por ID */
    project:
      'SELECT project_name AS name, project_description AS description, project_link AS link FROM user_projects WHERE project_id  = $1',
    /**Selecciona la descripcion completa de titulo de educacion por ID */
    title:
      'SELECT entity_name AS School, title, start_date AS start, finish_date AS graduation FROM user_education WHERE education_id = $1',
  },
  /**Queries para el manejo de JSONWebTokens */
  jwt: {
    /**Inserta un nuevo token en la base de datos, invalidandolo */
    invalidate:
      'INSERT INTO invalid_jwt(token, invalidated_at) VALUES($1, NOW())',
    /**Verifica si el token indicado existe en la base de datos
     * siendo invalido si este se encuentra registrado
     */
    isValid: 'SELECT token FROM invalid_jwt WHERE token = $1',
  },
  /**Queries para borrar informacion relacionada a usuarios */
  removeUser: {
    /**Borra la abilidad registrada con la ID indicada */
    ability: 'DELETE FROM user_abilities WHERE ability_id = $1',
    /**Borra la descripcion de experience de trabajo registrada con la ID indicada */
    experience: 'DELETE FROM user_experience WHERE job_id = $1',
    /**Borra un premio por ID */
    award: 'DELETE FROM user_awards WHERE award_id = $1',
    /**Borra un proyecto por ID */
    project: 'DELETE FROM user_projects WHERE project_id = $1',
    /**Borra un registro de educacion por ID */
    education: 'DELETE FROM user_education WHERE education_id = $1',
  },
  /**Queries relacionados a la barra de busqueda */
  search: {
    /**Retorna una lista de usuarios cuyo nombre sea similar a la busqueda realizada */
    users:
      "SELECT u.user_id AS id, u.name, ud.last_name AS description FROM users u LEFT JOIN user_description ud ON u.user_id = ud.user_id WHERE u.name ILIKE $1 || '%'",
  },
  /**Queries relacionados a las notificaciones */
  notifications: {
    /**Inserta un nuevo token de notificacion vinculado a cierto usuario */
    register: 'INSERT INTO notification_tokens(user_id, token) VALUES($1, $2)',
    /**Actualiza el token vinculado a cierto usuario */
    updateToken:
      'UPDATE notification_tokens SET token = $1 WHERE user_id = $2 RETURNING *',
    /**Borra un token comparando por ID de usuario */
    deleteWithID: 'DELETE FROM notification_tokens WHERE user_id = $1',
    /**Borra un token comparando por valor de token */
    deleteWithToken: 'DELETE FROM notification_tokens WHERE token = $1',
  },
  /**Queries para el manejo de conexion de usuarios */
  connects: {
    /**Verifica si dos usuarios estan conectados */
    connected: '',
    /**Crea un request de conexion entre usuarios */
    request: '',
    /**Elimina la conexion entre dos usuarios */
    disconnect: '',
    /**Crea una nueva conexion entre usuarios */
    connect: '',
    /**Elimina el request de conexion entre usuarios */
    deleteRequest: '',
    /**Verifica si hay un request de conexiones entre dos usuarios */
    requestPending: '',
  },
  /**Queries para el manejo de los post */
  post: {
    /**Insertar datos del post creado */
    createPost:'INSERT INTO posts(content,date) VALUES($1,NOW()) RETURNING post_id',
    /**Actulizar posts ya creados */
    updatePost:'UPDATE posts SET content=$1, media=$2, date=$3 WHERE post_id=$4 RETURNING post_id',
    /**Actulizacion de archivos */
    updateMedia:'UPDATE posts SET media=$1 WHERE post_id=$2 RETURNING post_id',
    /**Seleccionar post */
    readerPost:'SELECT content, media, date FROM posts WHERE post_id=$1',
    /**Borrar Post */
    deletePost:'DELETE FROM posts WHERE post_id=$1'
  }
};
