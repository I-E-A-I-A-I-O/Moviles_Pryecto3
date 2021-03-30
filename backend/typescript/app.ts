import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import Admin, {ServiceAccount} from 'firebase-admin';
import multer from 'multer';
import helmet from 'helmet';
import notificationRoutes from './routers/notifications';

import {userRouter, codeRouter, searchBarRouter} from './routers';

const serviceAccount: ServiceAccount = {
  projectId: process.env.project_id,
  clientEmail: process.env.client_email,
  privateKey: process.env.private_key?.replace(/\\n/g, '\n'),
};

Admin.initializeApp({
  credential: Admin.credential.cert(serviceAccount),
});

const app = express();
const form = multer();
const port = process.env.PORT || 8000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  form.fields([
    {name: 'avatar', maxCount: 1},
    {name: 'post_media', maxCount: 1},
  ])
);

app.use('/notifications', notificationRoutes);
app.use('/users', userRouter);
app.use('/verification-codes', codeRouter);
app.use('/list', searchBarRouter);

app.listen(port, () => {
  console.info(`Server running at port ${port}`);
});
