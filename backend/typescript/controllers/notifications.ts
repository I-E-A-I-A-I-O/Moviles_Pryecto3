import admin from 'firebase-admin';
import { Request, Response } from 'express';

const registerToken = async (req: Request, res: Response) => {
    const { token } = req.body;
    try {
        
       await admin.messaging().sendToDevice([token], {
            notification: {
                title: 'Manga Reader',
                body: 'Hello',
                sound: 'default',
            }
        }, {
            priority: 'high',
        })
        res.status(200).send('Yes jeje');
    } catch (err) {
        console.error(err);
        res.status(500).send('error');
    }
}

export {
    registerToken
}