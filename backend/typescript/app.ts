import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import Admin, {ServiceAccount} from 'firebase-admin';

import notificationRoutes from './routers/notifications';

const serviceAccount: ServiceAccount = {
    projectId: process.env.project_id,
    clientEmail: process.env.client_email,
    privateKey: process.env.private_key
}

Admin.initializeApp({
    credential: Admin.credential.cert(serviceAccount)
})

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use('/notifications', notificationRoutes);

app.listen(port, () => {
    console.info(`Server running at port ${port}`);
});