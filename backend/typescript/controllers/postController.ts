import { Request, Response } from "express";
import { dbController, queries, jwt } from "../helpers";
import {postCRUD } from "./controllers_defs/CRUD";
import fse from "fs-extra";

export class PostController extends postCRUD{
    
    public async create(req: Request, res: Response){
        let {text, id, file} = req.body;
        console.log(text,id,file)
    }
    public async update(req: Request, res: Response){
        
    }
    public async read(req: Request, res: Response){
        
    }
    public async delete(v: string){
        
    }
}
