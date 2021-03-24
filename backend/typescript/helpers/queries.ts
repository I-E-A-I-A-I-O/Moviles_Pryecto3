export = {
    /*Vericar que el correo y numero de tlf no existen*/
    areCredentialsNew: 'SELECT * FROM users WHERE email = $1 OR phone = $2',
    /**
     * Se toman los codigos existentes actualmente con status "PENDING" para comparar y
     * evitar duplicados
     */
    getExistentCodes: 'SELECT code FROM code_verification WHERE status = $1',
    /*Se guarda un nuevo codigo de verificacion con status "PENDING"*/
    insertNewCode: 'INSERT INTO code_verification(email, code, status, last_update) VALUES($1, $2, $3, NOW()) RETURNING verification_id',
    /*Se borra el codigo de la base de datos, invalidandolo*/
    invalidateCode: 'DELETE FROM code_verification WHERE verification_id = $1',
}