import { Request, Response } from "express";

export abstract class BasicCRUD {
  public abstract create(req: Request, res: Response): void;
  public abstract read(req: Request, res: Response, target: string): void;
  public abstract update(req: Request, res: Response, target: string): void;
  public abstract delete(req: Request, res: Response, target: string): void;
}

export abstract class CodeCRUD {
  public abstract create(req: Request, res: Response): void;
  public abstract update(req: Request, res: Response): void;
  public abstract read(req: Request, res: Response): void;
  protected abstract delete(verification_id: string): void;
}
