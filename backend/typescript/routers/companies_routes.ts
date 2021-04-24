import express, { Request, Response } from 'express';

import {createCompanies} from '../controllers';

export const router = express.Router({
    strict: true
});

router.post('/dataCompanies', (req: Request, res: Response) => {
    createCompanies.create(req,res);
})