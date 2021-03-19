import express from 'express';

import { registerToken } from '../controllers/notifications';

const router = express.Router();

router.post('/', registerToken)

export default router;