
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import jwt from 'express-jwt';
import jwks from 'jwks-rsa';
import { Db, MongoClient } from 'mongodb';
import * as Unsplash from 'unsplash-js';
import nodeFetch from 'node-fetch';

import { initEnv } from './env';

import templateRoute from './routes/template';
import websiteRoute from './routes/website';
import domainnameRoute from './routes/domainname';
import publishRoute from './routes/publish';
import photoRoute from './routes/photo';
import { membershipRouter, stripewhRouter } from './routes/membership';
import stripeRouter from './routes/stripe';

export let mongoClient: MongoClient;
export let db: Db;
export let unsplashApi: ReturnType<typeof Unsplash.createApi>;

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}


async function run() {

  await initEnv();

  // @ts-ignore
  unsplashApi = Unsplash.createApi({
    accessKey: process.env.UNSPLASH_ACCESS!,
    fetch: nodeFetch,
  });

  mongoClient = new MongoClient(process.env.MONGO_URI!, { useUnifiedTopology: true, useNewUrlParser: true });
  await mongoClient.connect();

  db = mongoClient.db('cloverweb');

  let expressApp = express();

  expressApp.use(cors());

  // No auth routes
  expressApp.use('/stripewh', stripewhRouter);

  // Status
  expressApp.get('/status', async (req, res) => {
    res.status(200).send('Sparly web back-end, up and running !');
  });

  // Health check
  expressApp.get('/', async (req, res) => {
    res.status(204).end();
  });

  var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: 'https://clovercloud.eu.auth0.com/.well-known/jwks.json',
    }),
    audience: 'cloverweb-backend',
    issuer: 'https://clovercloud.eu.auth0.com/',
    algorithms: ['RS256'],
    getToken: r => r.header('Authorization')?.replace(/^Bearer /, ''),
  });

  // Express boilerplate
  expressApp.use(express.json());
  expressApp.use(bodyParser.urlencoded({ extended: true }));

  expressApp.use(jwtCheck);

  // Auth routes
  expressApp.use('/template', templateRoute);
  expressApp.use('/website', websiteRoute);
  expressApp.use('/domainname', domainnameRoute);
  expressApp.use('/publish', publishRoute);
  expressApp.use('/photo', photoRoute);
  expressApp.use('/membership', membershipRouter);
  expressApp.use('/stripe', stripeRouter);

  const port = process.env.PORT || 5000;
  // Has express server listen
  expressApp.listen(port);
  console.log(`Express http server started! (port ${port})`);

}

run();
