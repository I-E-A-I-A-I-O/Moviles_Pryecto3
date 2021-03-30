import express, {Request, Response} from 'express';

import {searchResults} from '../controllers';

export const router = express.Router({
  strict: true,
});

router.get('/people/:scope/:search', (req: Request, res: Response) => {
  searchResults.search(req, res, 'people');
});
