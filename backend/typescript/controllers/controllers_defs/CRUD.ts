import { Request, Response } from 'express';

export abstract class BasicCRUD {
    public abstract create(req: Request, res: Response): void;
    public abstract read(req: Request, res: Response): void;
    public abstract update(req: Request, res: Response): void;
    public abstract delete(req: Request, res: Response): void;
}