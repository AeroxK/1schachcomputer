import { Router, Request, Response } from 'express';
import { Collection } from 'mongodb';

import { getCollection } from '../Database/database';
import { loginApiUrl, registerApiUrl } from '../../shared/api/config';
import { LoginRequest, UserData } from '../../shared/api/types';
import { logger } from '../Logger/logger';

const router = Router();

router.post(loginApiUrl, (req: Request, res: Response) => {
    const request:LoginRequest = req.body;
    const userCollection:Collection<UserData> = getCollection('users');
    userCollection.findOne(request).then(user => {
        if (user) {
            res.type('application/json');
            res.status(200);
            res.send(user);
            logger.info(`User logged in: ${user.username}`);
        } else {
            res.sendStatus(404);
        }
    });
});

router.post(registerApiUrl, (req: Request, res: Response) => {
    const request:LoginRequest = req.body;
    const userCollection:Collection<UserData> = getCollection('users');
    userCollection.findOne({ username: request.username }).then(user => {
        if (user) {
            res.sendStatus(409);
        } else {
            userCollection.insertOne(request).then(result => {
                res.type('application/json');
                res.status(201);
                res.send(result.ops[0]);
                logger.info(`New User created: ${result.ops[0].username}`);
            });
        }
    });
});

export default router;
