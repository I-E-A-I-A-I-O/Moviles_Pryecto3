import express, {Request, Response} from 'express';
import {queries} from '../../helpers';
import {deleteUser} from '../../controllers';

export const router = express.Router({
  strict: true,
});

router.delete('/user/abilities/ability/:id', (req: Request, res: Response) => {
  deleteUser.removeDescription(req, res, queries.removeUser.ability);
});

router.delete('/user/jobs/job/:id', (req: Request, res: Response) => {
  deleteUser.removeDescription(req, res, queries.removeUser.experience);
});

router.delete('/user/awards/award/:id', (req: Request, res: Response) => {
  deleteUser.removeDescription(req, res, queries.removeUser.award);
});

router.delete('/user/projects/project/:id', (req: Request, res: Response) => {
  deleteUser.removeDescription(req, res, queries.removeUser.project);
});

router.delete('/user/titles/title/:id', (req: Request, res: Response) => {
  deleteUser.removeDescription(req, res, queries.removeUser.education);
});

router.delete('/user', (req: Request, res: Response) => {
  deleteUser.delete(req, res);
});
