import { Request, Response } from "express";
import { dbController, queries, jwt } from "../helpers";
import {postCRUD } from "./controllers_defs/CRUD";
import fse from "fs-extra";

export class PostController extends postCRUD{
    
    public async create(req: Request, res: Response){
        let {content} = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const client = await dbController.getClient();
        try{
           let results = await client.query(queries.post.createPost,[content]);
           const post_id: string = results.rows[0].post_id;
           if(files.file){
            const absolutePath = `media/avatars/${post_id}/${files.file[0].originalname}`;
            await fse.outputFile(absolutePath, files.avatar[0].buffer);
            await client.query(queries.post.updateMedia, [absolutePath, post_id]);
            res.status(201).json({
              title: "success",
              content: "Post Create!",
            });
           }else{
            res.status(500).json({
                title: "Error",
                content: "error creating post!",
              });
           }
        }catch(err){
            res.status(500).json({
                title: "Error",
                content: "error creating post!",
              });
        }finally {
            client.release(true);
          }
    }

    public async read(req: Request, res: Response){
        
    }

    public async update(req: Request, res: Response){
        
    }
   
    public async delete(v: string){
        
    }
}
