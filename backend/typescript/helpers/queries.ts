export = {
    /** Verica que el correo y numero de telefono no existen*/
    areCredentialsNew: 'SELECT * FROM users WHERE email = $1 OR phone = $2',
    /**
     * Se toman los codigos existentes actualmente con status "PENDING" para comparar y
     * evitar duplicados
     */
    getExistentCodes: 'SELECT code FROM code_verification WHERE status = $1',
    /** Se guarda un nuevo codigo de verificacion con status "PENDING"*/
    insertNewCode: 'INSERT INTO code_verification(email, code, status, last_update) VALUES($1, $2, $3, NOW()) RETURNING verification_id',
    /** Se borra el codigo de la base de datos, invalidandolo*/
    invalidateCode: 'DELETE FROM code_verification WHERE verification_id = $1',
    /**/
    getExistentEmail: 'SELECT user_id, email, password FROM users WHERE email = $1',
    /**Verifica que el codigo existe y tiene status "PENDING" */
    verifyCode: 'SELECT verification_id, email, code FROM code_verification WHERE verification_id = $1 AND code = $2 AND status = $3',
    /**Cambia el status de un codigo verificado exitosamente de
     * "PENDING" a "COMPLETED"
     */
    setCompleted: 'UPDATE code_verification SET status = $1, last_update = NOW() WHERE verification_id = $2',
    /**Inserta un nuevo usuario a la tabla y retorna la nueva ID*/
    registerUser: 'INSERT INTO users(name, email, phone, password, creation_date) VALUES($1, $2, $3, $4, NOW()) RETURNING user_id',
    /**Se actualiza el campo avatar del usuario con la ID indicada*/
    setAvatar: 'UPDATE users SET avatar = $1 WHERE user_id = $2',
    /**Empieza una transaccion */
    begin: 'BEGIN',
    /**Confirma una transaccion */
    commit: 'COMMIT',
    /**Cancela una transaccion */
    rollback: 'ROLLBACK',
}