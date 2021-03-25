import {Request, Response} from 'express';
import {dbController, queries} from '../helpers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class UserLogin{
     
    public async userLogin(req: Request, res: Response){
        const {email, password} = req.body;

        if(email === "" || password ===""){
            res.status(400).json({title: 'Error', content: 'Error reading form.'});
        }else{
            this.verifyLogin(email, password).then(result => {
                if (result.result){
                    res.status(200).json({title: 'Success', content: result.token});
                }
                else{
                    res.status(403).json({title: 'Error', content: result.message});
                }
            })
        }
    }

    private async verifyLogin(email: string, password: string){
        let client = await dbController.getClient();
        try{
            let result = await client.query(queries.getExistentEmail, [email]);
            if (result.rowCount > 0){
                let compare = bcrypt.compare(password, result.rows[0].password);
                if (compare){
                    let token = jwt.sign({email: email, id: result.rows[0].user_id}, ""+process.env.SECRET_JWT);
                    return {result: true, token: token, message: 'Login success.'};
                }
                else{
                    return {result: false, token: null, message: 'Incorrect password.'};
                }
            }
            else{
                return {result: false, token: null, message: 'Email not found.'};
            }
        }catch(e){
            console.log(e);
            return {result: false, token: null, message: 'Error checking credentials.'};
        }finally{
            client.release();
        }
    }
    

}