import {Request, Response} from 'express';
import {companiesCRUD} from '../controllers_defs/CRUD'
import {dbController, queries, jwt} from '../../helpers';
import fse from 'fs-extra';

export class CreateCompanies extends companiesCRUD{
    public async create(req: Request, res: Response){  
        const files = req.files as {[fieldname: string]: Express.Multer.File[]};
        const client = await dbController.getClient();
        let {name, email,phone} = req.body;
        try {
            await client.query(queries.transaction.begin);
            let results = await client.query(queries.companies.newCompaines, [
              name,
              email,
              phone,
              ''
            ]);
            const user_id: string = results.rows[0].user_id;           
            if (!files.logo) {
              await client.query(queries.transaction.commit);
              res.status(201).json({
                title: 'success',
                content: 'Company created!',
              });
            } else {
              const absolutePath = `media/avatars/${user_id}/${files.logo[0].originalname}`;
              await fse.outputFile(absolutePath, files.logo[0].buffer);
              await client.query(queries.companies.logo, [absolutePath, user_id]);
              await client.query(queries.transaction.commit);
              res.status(201).json({
                title: 'success',
                content: 'Company created!',
              });
            }
          } catch (err) {
            console.error(err.message);
            await client.query(queries.transaction.rollback);
            res.status(503).json({
              title: 'error',
              content: 'The company could not be created.',
            });
          } finally {
            client.release(true);
          }
    }
    
    
    public async read(req: Request, res: Response){

    }
    
    
    public async update(req: Request, res: Response){
        
    }

    public async delete(id: string){
      
    }
}