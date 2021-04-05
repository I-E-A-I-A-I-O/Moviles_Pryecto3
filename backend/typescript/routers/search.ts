import express, {Request, Response} from 'express';

import {searchResults} from '../controllers';

export const router = express.Router({
  strict: true,
});

router.get('/people/:scope/:search', (req: Request, res: Response) => {
  searchResults.searchPeople(req, res);
});

router.get('/posts/:scope/', (req: Request, res: Response) => {
  searchResults.searchPosts(req, res);
});

router.get('/posts/:scope/:search', (req: Request, res: Response) => {
  searchResults.searchPostsMatch(req, res);
});
