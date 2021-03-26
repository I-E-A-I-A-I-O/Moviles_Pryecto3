export = {
    /**Queries para el manejo de codigos de verificacion */
    verification_codes: {
        /**Selecciona los codigos de verificacion existentes con status "PENDING" */
        getExistentCodes: 'SELECT code FROM code_verification WHERE status = $1',
        /** Se guarda un nuevo codigo de verificacion con status "PENDING"*/
        insertNewCode: 'INSERT INTO code_verification(email, code, status, last_update) VALUES($1, $2, $3, NOW()) RETURNING verification_id',
        /** Se borra el codigo de la base de datos, invalidandolo*/
        invalidateCode: 'DELETE FROM code_verification WHERE verification_id = $1',
        /**Verifica que el codigo existe y tiene status "PENDING" */
        verifyCode: 'SELECT verification_id, email, code FROM code_verification WHERE verification_id = $1 AND code = $2 AND status = $3',
        /**Cambia el status de un codigo verificado exitosamente de
         * "PENDING" a "COMPLETED"
         */
        setCompleted: 'UPDATE code_verification SET status = $1, last_update = NOW() WHERE verification_id = $2',
    },
    /**Queries para insertar nueva informacion de usuarios */
    insertUser: {
        /**Inserta un nuevo usuario a la tabla y retorna la nueva ID*/
        new: 'INSERT INTO users(name, email, phone, password, creation_date) VALUES($1, $2, $3, $4, NOW()) RETURNING user_id',
        /**Inserta nueva informacion a user_description vinculada al usuario de la ID indicada */
        description: 'INSERT INTO user_description(user_id, last_name, gender, address, country, age, description, birth_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
    },
    /**Queries para editar informacion existente de usuarios */
    setUser: {
        /**Se actualiza el campo avatar del usuario con la ID indicada*/
        avatar: 'UPDATE users SET avatar = $1 WHERE user_id = $2',
        /**Se actualiza la informacion de user_description pertenenciente al 
         * usuario de la ID indicada */
        description: 'UPDATE user_description SET description = $1, country = $2, age = $3, gender = $4, address = $5, last_name = $6, birth_date = $7 WHERE user_id = $8 RETURNING *',
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
        abilites: 'SELECT name FROM user_abilities WHERE user_id = $1',
        /**Selecciona los premios añadidos por el usuario de la ID indicada  */
        awards: 'SELECT award_id, title FROM user_awards WHERE user_id = $1',
        /**Selecciona la descripcion general (fecha de nacimiento, edad, pais de residencia, etc...) 
         * añadida por el usuario de la ID indicada
         */
        description: 'SELECT * FROM user_description WHERE user_id = $1',
        /**Selecciona los registros de educacion añadidos por el usuario de la ID
         * indicada
         */
        titles: 'SELECT education_id, title FROM user_education WHERE user_id = $1',
        /**Selecciona los registros de experiencia laboral añadidos por el usuario de la ID
         * indicada
         */
        experience: 'SELECT job_id, job_title FROM user_experience WHERE user_id = $1',
        /**Selecciona los registros de proyectos añadidos por el usuario de la ID indicada */
        projects: 'SELECT project_id, project_name FROM user_projects WHERE user_id = $1',
        /**Selecciona las recomendaciones recibidas por el usuario de la ID indicada */
        recommendations: 'SELECT * FROM user_recommendations WHERE recommended_user = $1',
    },
    /**Queries para el manejo de JSONWebTokens */
    jwt: {
        /**Inserta un nuevo token en la base de datos, invalidandolo */
        invalidate: 'INSERT INTO invalid_jwt(token, invalidated_at) VALUES($1, NOW())',
        /**Verifica si el token indicado existe en la base de datos
         * siendo invalido si este se encuentra registrado
         */
        isValid: 'SELECT token FROM invalid_jwt WHERE token = $1',
    },
}