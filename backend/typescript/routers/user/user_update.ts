import express, {Request, Response} from 'express';
import {updateUser} from '../../controllers';
import {queries} from '../../helpers';

export const router = express.Router({
  strict: true,
});

router.patch('/user/general', (req: Request, res: Response) => {
  updateUser.updateGeneral(req, res);
});

router.patch('/user/jobs/job/:id', (req: Request, res: Response) => {
  updateUser.update(req, res, queries.setUser.job, [
    req.body.org_name,
    req.body.title,
    req.body.description,
    req.body.startDate,
    req.body.finishDate,
    req.params.id,
  ]);
});

router.patch('/user/awards/award/:id', (req: Request, res: Response) => {
  updateUser.update(req, res, queries.setUser.award, [
    req.body.title,
    req.body.description,
    req.body.by,
    req.body.date,
    req.params.id,
  ]);
});

router.patch('/user/projects/project/:id', (req: Request, res: Response) => {
  updateUser.update(req, res, queries.setUser.project, [
    req.body.title,
    req.body.description,
    req.body.link,
    req.params.id,
  ]);
});

router.patch('/user/titles/title/:id', (req: Request, res: Response) => {
  updateUser.update(req, res, queries.setUser.education, [
    req.body.school,
    req.body.title,
    req.body.start,
    req.body.graduation,
    req.params.id,
  ]);
});

router.put('/user/avatar', (req: Request, res: Response) => {
  updateUser.updateAvatar(req, res);
});

router.put('/user/name', (req: Request, res: Response) => {
  updateUser.updateName(req, res);
});

router.put('/user/credentials/password', (req: Request, res: Response) => {
  updateUser.updatePassword(req, res);
});

router.put('/user/credentials/email', (req: Request, res: Response) => {
  updateUser.updateEmail(req, res);
});

router.put('/user/credentials/phone', (req: Request, res: Response) => {
  updateUser.updatePhone(req, res);
});
