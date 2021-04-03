import express, {Request, Response} from 'express';
import {userCreate} from '../../controllers';
import {queries} from '../../helpers';

export const router = express.Router({
  strict: true,
});

router.post('/user', (req: Request, res: Response) => {
  userCreate.create(req, res);
});

router.post('/user/abilities/ability', (req: Request, res: Response) => {
  userCreate.addDescription(
    req,
    res,
    queries.insertUser.ability,
    [req.body.ability],
    true
  );
});

router.post('/user/jobs/job', (req: Request, res: Response) => {
  userCreate.addDescription(req, res, queries.insertUser.experience, [
    req.body.org_name,
    req.body.description,
    req.body.title,
    req.body.startDate,
    req.body.finishDate,
  ]);
});

router.post('/user/awards/award', (req: Request, res: Response) => {
  userCreate.addDescription(req, res, queries.insertUser.award, [
    req.body.title,
    req.body.description,
    req.body.by,
    req.body.date,
  ]);
});

router.post('/user/projects/project', (req: Request, res: Response) => {
  userCreate.addDescription(req, res, queries.insertUser.project, [
    req.body.title,
    req.body.description,
    req.body.link,
  ]);
});

router.post('/user/titles/title', (req: Request, res: Response) => {
  userCreate.addDescription(req, res, queries.insertUser.education, [
    req.body.school,
    req.body.title,
    req.body.start,
    req.body.graduation,
  ]);
});
