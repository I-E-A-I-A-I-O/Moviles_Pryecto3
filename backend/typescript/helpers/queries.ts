/**
 * Los parametros deben pasarse en el orden indicado,
 * a menos que explicitamente que se diga que no importa el orden
 */
export = {
  /**Queries para el manejo de codigos de verificacion */
  verification_codes: {
    /**Selecciona los codigos de verificacion existentes con status indicado.
     *
     * Parametros:
     * 1. status = 'PENDING' | 'COMPLETED'
     */
    getExistentCodes: 'SELECT code FROM code_verification WHERE status = $1',
    /** Se guarda un nuevo codigo de verificacion.
     *
     * Parametros:
     * 1. Email
     * 2. Codigo de verificacion
     * 3. Status (que deberia ser PENDING)
     */
    insertNewCode:
      'INSERT INTO code_verification(email, code, status, last_update) VALUES($1, $2, $3, NOW()) RETURNING verification_id',
    /** Se borra el codigo de la base de datos, invalidandolo.
     *
     * Parametros:
     * 1. La ID del codigo
     */
    invalidateCode: 'DELETE FROM code_verification WHERE verification_id = $1',
    /**
     * Verifica que el codigo existe y tiene el status indicado.
     * Parametros:
     * 1. La ID del codigo
     * 2. El codigo de verificacion
     * 3. Status = 'PENDING' | 'COMPLETED'
     */
    verifyCode:
      'SELECT verification_id, email, code FROM code_verification WHERE verification_id = $1 AND code = $2 AND status = $3',
    /**
     * Cambia el status de un codigo de verificacion.
     * Parametros:
     * 1. Status = 'PENDING' | 'COMPLETED'
     * 2. La ID del codigo
     */
    setCompleted:
      'UPDATE code_verification SET status = $1, last_update = NOW() WHERE verification_id = $2',
  },
  /**Queries para insertar nueva informacion de usuarios */
  insertUser: {
    /**Inserta un nuevo usuario a la tabla y retorna la nueva ID.
     * Paramentros:
     * 1. Nombre
     * 2. Email
     * 3. Numero de telefono
     * 4. Contraseña
     */
    new:
      'INSERT INTO users(name, email, phone, password, creation_date) VALUES($1, $2, $3, $4, NOW()) RETURNING user_id',
    /**Inserta nueva informacion a user_description vinculada al usuario de la ID indicada.
     * Parametros:
     * 1. La ID del usuario
     * 2. Apellido (opcional)
     * 3. Genero (opcional)
     * 4. Direccion donde vive (opcional)
     * 5. Pais de residencia (opcional)
     * 6. Edad (opcional)
     * 7. Descripcion personal (opcional)
     * 8. Fecha de nacimiento (opcional)
     */
    description:
      'INSERT INTO user_description(user_id, last_name, gender, address, country, age, description, birth_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
    /**Añade una nueva habilidad a la lista perteneciente al usuario de la ID indicada.
     * Parametros:
     * 1. ID del usuario
     * 2. Nombre de la habilidad
     */
    ability:
      'INSERT INTO user_abilities(user_id, name) VALUES($1, $2) RETURNING *',
    /**Añade una nueva descripcion de experiencia de trabajo a la lista del usuario
     * de la ID indicada.
     * Parametros:
     * 1. ID del usuario
     * 2. Nombre de la organizacion
     * 3. Descripcion del trabajo (opcional)
     * 4. Titulo del puesto de trabajo
     * 5. Fecha de inicio
     * 6. Fecha de final (En la que fue despedido/renuncio/se retiro)
     */
    experience:
      'INSERT INTO user_experience(user_id, org_name, job_description, job_title, start_date, finish_date) VALUES($1, $2, $3, $4, $5, $6)',
    /**Registra un nuevo premio vinculado al usuario de la ID indicada.
     * Parametros:
     * 1. ID del usuario
     * 2. Titulo del premio
     * 3. Descripcion del premio (opcional)
     * 4. Nombre de la entidad que emitio el premio
     * 5. Fecha cuando fue recibido el premio
     */
    award:
      'INSERT INTO user_awards(user_id, title, description, given_by, date) VALUES($1, $2, $3, $4, $5)',
    /**Registra un nuevo proyecto vinculado al usuario de la ID indicada.
     * Parametros:
     * 1. ID del usuario
     * 2. Nombre del proyecto
     * 3. Descripcion del proyecto (opcional)
     * 4. Un link donde se pueda ubicar el proyecto en la web (opcional)
     */
    project:
      'INSERT INTO user_projects(user_id, project_name, project_description, project_link) VALUES($1, $2, $3, $4)',
    /**Añade un nuevo registro de educacion al usuario de la ID indicada.
     * Parametros:
     * 1. ID del usuario
     * 2. Nombre de la casa de estudio
     * 3. Titulo recibido/que se espera recibir
     * 4. Fecha de inicio
     * 5. Fecha de graduacion/dropout
     */
    education:
      'INSERT INTO user_education(user_id, entity_name, title, start_date, finish_date) VALUES($1, $2, $3, $4, $5)',
  },
  /**Queries para editar informacion existente de usuarios */
  setUser: {
    /**Se actualiza el campo avatar del usuario con la ID indicada.
     * Parametros:
     * 1. Path hacia la imagen
     * 2. ID del usuario
     */
    avatar: 'UPDATE users SET avatar = $1 WHERE user_id = $2',
    /**Se actualiza la informacion de user_description pertenenciente al
     * usuario de la ID indicada.
     * Parametros:
     * 1. Descripcion (opcional)
     * 2. Pais (opcional)
     * 3. Edad (opcional)
     * 4. Genero (opcional)
     * 5. Direccion (opcional)
     * 6. Apellido (opcional)
     * 7. Fecha de nacimiento (opcional)
     * 8. ID del usuario
     */
    description:
      'UPDATE user_description SET description = $1, country = $2, age = $3, gender = $4, address = $5, last_name = $6, birth_date = $7 WHERE user_id = $8 RETURNING *',
    /**
     * Edita la descripcion de experiencia de trabajo registrada con la ID dada.
     * Parametros:
     * 1. Nombre de la organizacion
     * 2. Titulo del puesto de trabajo
     * 3. Descripcion del trabajo (opcional)
     * 4. Fecha de inicio
     * 5. Fecha de fin
     * 6. ID de usuario
     */
    job:
      'UPDATE user_experience SET org_name = $1, job_title = $2, job_description = $3, start_date = $4, finish_date = $5 WHERE job_id = $6',
    /**Edita la descripcion de premio recibido por ID.
     * Parametros:
     * 1. Titulo del premio
     * 2. Descripcion (opcional)
     * 3. Nombre de la entidad que emitio el premio
     * 4. Fecha en que se recibio el premio
     * 5. ID del premio
     */
    award:
      'UPDATE user_awards SET title = $1, description = $2, given_by = $3, date = $4 WHERE award_id = $5',
    /**Edita el proyecto con la ID indicada.
     * Parametros:
     * 1. Nombre del proyecto
     * 2. Descripcion del proyecto (opcional)
     * 3. Link del proyecto (opcional)
     * 4. ID del proyecto
     */
    project:
      'UPDATE user_projects SET project_name = $1, project_description = $2, project_link = $3 WHERE project_id = $4',
    /**Edita el registro de educacion con la ID indicada.
     * Parametros:
     * 1. Nombre de la casa de estudio
     * 2. Nombre del titulo
     * 3. Fecha de inicio
     * 4. Fecha de graduacion/dropout
     * 5. ID del titulo
     */
    education:
      'UPDATE user_education SET entity_name = $1, title = $2, start_date = $3, finish_date = $4 WHERE education_id = $5',
    /**Cambia el nombre de un usuario.
     * Parametros:
     * 1. Nombre
     * 2. ID del usuario
     */
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
     * con el email indicado.
     * Parametros:
     * 1. Email del usuario
     */
    credentials: 'SELECT user_id, name, password FROM users WHERE email = $1',
    /**Selecciona las filas que coincidan con el Email o numero telefonico
     * proporcionados.
     * Parametros:
     * 1. Email del usuario
     * 2. Numero de telefono
     */
    areCredentialsNew: 'SELECT * FROM users WHERE email = $1 OR phone = $2',
    /**Selecciona el avatar del usuario registrado con la ID indicada.
     * Parametros:
     * 1. ID del usuario
     */
    avatar: 'SELECT avatar FROM users WHERE user_id = $1',
    /**Selecciona las abilidades añadidas por el usuario de la ID indicada.
     * Parametros:
     * 1. ID del usuario
     */
    abilites: 'SELECT ability_id, name FROM user_abilities WHERE user_id = $1',
    /**Selecciona los premios añadidos por el usuario de la ID indicada.
     * Parametros:
     * 1. ID del usuario
     */
    awards:
      'SELECT award_id AS id, title AS name FROM user_awards WHERE user_id = $1',
    /**Selecciona la descripcion general (fecha de nacimiento, edad, pais de residencia, etc...)
     * añadida por el usuario de la ID indicada.
     * Parametros:
     * 1. ID del usuario
     */
    description: 'SELECT * FROM user_description WHERE user_id = $1',
    /**Selecciona los registros de educacion añadidos por el usuario de la ID
     * indicada.
     * Parametros:
     * 1. ID del usuario
     */
    titles:
      'SELECT education_id AS id, title AS name FROM user_education WHERE user_id = $1',
    /**Selecciona los registros de experiencia laboral añadidos por el usuario de la ID
     * indicada.
     * Parametros:
     * 1. ID del usuario
     */
    experience:
      'SELECT job_id AS id, job_title AS name FROM user_experience WHERE user_id = $1',
    /**Selecciona los registros de proyectos añadidos por el usuario de la ID indicada.
     * Parametros:
     * 1. ID del usuario
     */
    projects:
      'SELECT project_id AS id, project_name AS name FROM user_projects WHERE user_id = $1',
    /**Selecciona las recomendaciones recibidas por el usuario de la ID indicada.
     * Parametros:
     * 1. ID del usuario
     */
    recommendations:
      'SELECT * FROM user_recommendations WHERE recommended_user = $1',
    /**Seleccion una descripcion completa de experiencia de trabajo por ID.
     * Parametros:
     * 1. ID del trabajo
     */
    job:
      'SELECT org_name AS Organization, job_description AS Description, job_title AS Title, start_date AS Start, finish_date AS End FROM user_experience WHERE job_id = $1',
    /**Seleccion una descripcion completa de premio recibido por ID.
     * Parametros:
     * 1. ID del premio
     */
    award:
      'SELECT title, description, given_by AS by, date FROM user_awards WHERE award_id = $1',
    /**Selecciona la descripcion completa de un proyecto por ID.
     * Parametros:
     * 1. ID del proyecto
     */
    project:
      'SELECT project_name AS name, project_description AS description, project_link AS link FROM user_projects WHERE project_id  = $1',
    /**Selecciona la descripcion completa de titulo de educacion por ID.
     * Parametros:
     * 1. ID del titulo
     */
    title:
      'SELECT entity_name AS School, title, start_date AS start, finish_date AS graduation FROM user_education WHERE education_id = $1',
  },
  /**Queries para el manejo de JSONWebTokens */
  jwt: {
    /**Inserta un nuevo token en la base de datos, invalidandolo.
     * Parametros:
     * 1. Token
     */
    invalidate:
      'INSERT INTO invalid_jwt(token, invalidated_at) VALUES($1, NOW())',
    /**Verifica si el token indicado existe en la base de datos
     * siendo invalido si este se encuentra registrado.
     * Parametros:
     * 1. Token
     */
    isValid: 'SELECT token FROM invalid_jwt WHERE token = $1',
  },
  /**Queries para borrar informacion relacionada a usuarios */
  removeUser: {
    /**Borra la abilidad registrada con la ID indicada.
     * Parametros:
     * 1. ID de la habilidad
     */
    ability: 'DELETE FROM user_abilities WHERE ability_id = $1',
    /**Borra la descripcion de experience de trabajo registrada con la ID indicada.
     * Parametros:
     * 1. ID del trabajo
     */
    experience: 'DELETE FROM user_experience WHERE job_id = $1',
    /**Borra un premio por ID.
     * Parametros:
     * 1. ID del premio
     */
    award: 'DELETE FROM user_awards WHERE award_id = $1',
    /**Borra un proyecto por ID.
     * Parametros:
     * 1. ID del proyecto
     */
    project: 'DELETE FROM user_projects WHERE project_id = $1',
    /**Borra un registro de educacion por ID.
     * Parametros:
     * 1. ID del titulo
     */
    education: 'DELETE FROM user_education WHERE education_id = $1',
  },
  /**Queries relacionados a la barra de busqueda */
  search: {
    /**Retorna una lista de usuarios cuyo nombre sea similar a la busqueda realizada.
     * Parametros:
     * 1. String proveniente de la barra de busqueda
     */
    users:
      "SELECT u.user_id AS id, u.name, ud.last_name AS description FROM users u LEFT JOIN user_description ud ON u.user_id = ud.user_id WHERE u.name ILIKE $1 || '%'",
  },
  /**Queries relacionados a los tokens de notificaciones */
  notification_tokens: {
    /**Inserta un nuevo token de notificacion vinculado a cierto usuario.
     * Parametros:
     * 1. ID del usuario
     * 2. Token
     */
    register: 'INSERT INTO notification_tokens(user_id, token) VALUES($1, $2)',
    /**Actualiza el token vinculado a cierto usuario.
     * Parametros:
     * 1. Token
     * 2. ID del usuario
     */
    updateToken:
      'UPDATE notification_tokens SET token = $1 WHERE user_id = $2 RETURNING *',
    /**Borra un token comparando por ID de usuario.
     * Parametros:
     * 1. ID del usuario
     */
    deleteWithID: 'DELETE FROM notification_tokens WHERE user_id = $1',
    /**Borra un token comparando por valor de token.
     * Parametros:
     * 1. Token
     */
    deleteWithToken: 'DELETE FROM notification_tokens WHERE token = $1',
    /**
     * Retorna los tokens vinculados al ID del usuario.
     * Parametros:
     * 1. ID del usuario
     */
    getToken: 'SELECT token FROM notification_tokens WHERE user_id = $1',
  },
  /**Queries relacionados a las notificaciones de usuarios */
  notifications: {
    /**Crea una notificacion de post.
     * Parametros:
     * 1. Tipo = 'POST' | 'REQUEST' (Deberia ser POST en este caso)
     * 2. ID del post
     */
    post_noti:
      'INSERT INTO notifications(type, post_link, date) VALUES($1, $2, NOW()) RETURNING id',
    /**Borra una notificacion por ID.
     * Parametros:
     * 1. ID de la notificacion
     */
    delete: 'DELETE FROM notifications WHERE id = $1',
    /**Crea una notificacion de connect request.
     * Parametros:
     * 1. Tipo = 'POST' | 'REQUEST' (Deberia ser REQUEST en este caso)
     * 2. ID del connection request
     */
    connect_noti:
      'INSERT INTO notifications(type, request_link, date) VALUES($1, $2, NOW()) RETURNING id',
  },
  /**Queries para el manejo de connects de usuarios */
  connects: {
    /**Verifica si dos usuarios estan conectados.
     * Parametros:
     * 1. ID del usuario A
     * 2. ID del usuario B
     *
     * No importa el orden en que se pasen las ID
     */
    connected:
      'SELECT connection_id AS id FROM connects WHERE connector_id = $1 AND connected_id = $2',
    /**Crea un request de conexion entre usuarios.
     * Parametros:
     * 1. ID del usuario que mando la solicitud
     * 2. ID del usuario que recibira la solicitud
     */
    request:
      'INSERT INTO connection_requests(request_owner, request_receiver) VALUES($1, $2) RETURNING id',
    /**Elimina la conexion entre dos usuarios.
     * Parametros:
     * 1. ID del usuario A
     * 2. ID del usuario B
     *
     * No importa el orden en que se pasen las ID
     */
    disconnect:
      'DELETE FROM connections WHERE connector_id = $1 AND connected_id = $2',
    /**Crea una nueva conexion entre usuarios.
     * Parametros:
     * 1. ID del usuario A
     * 2. ID del usuario B
     *
     * No importa el orden que se pasen las ID
     */
    connect:
      'INSERT INTO connections(connector_id, connected_id) VALUES($1, $2) RETURNING connection_id AS id',
    /**Elimina el request de conexion entre usuarios.
     * Parametros:
     * 1. ID del connection request
     */
    deleteRequest: 'DELETE FROM connection_requests WHERE id = $1',
    /**Verifica si hay un request de conexiones entre dos usuarios
     * Parametros:
     * 1. ID del usuario que emitio el request
     * 2. ID del usuario que recibe el request
     */
    requestPending:
      'SELECT id FROM connection_requests WHERE request_owner = $1 AND request_receiver = $2',
  },
};
