
import express from 'express';
import { query } from 'express-validator';
import { unsplashApi } from '../index';

import AWS from 'aws-sdk';

const router = express.Router();

let translate = new AWS.Translate({ region: 'us-east-1' });

router.get(
  '/search',
  [
    query('s').isString().isLength({ min: 1, max: 500 }),
  ],
  async function(req: express.Request, res: express.Response) {

    const search = req.query.s as string;
    const searchEnglish = (await translate.translateText({ Text: search, SourceLanguageCode: 'auto', TargetLanguageCode: 'en' }).promise()).TranslatedText;

    const results = (await unsplashApi.search.getPhotos({ query: searchEnglish, perPage: 20 }))?.response?.results;

    return res.status(200).send({
      results: results?.map((e: any) => ({
        id: e.id,
        authorName: e.user.name,
        authorUsername: e.user.username,
      }))
    });
  }
);

router.put(
  '/upload',
  [
    query('s').isString().isLength({ min: 1, max: 500 }),
  ],
  async function(req: express.Request, res: express.Response) {

    const search = req.query.s as string;
    const searchEnglish = (await translate.translateText({ Text: search, SourceLanguageCode: 'auto', TargetLanguageCode: 'en' }).promise()).TranslatedText;

    const results = (await unsplashApi?.search?.getPhotos({ query: searchEnglish, perPage: 20 }))?.response?.results;

    return res.status(200).send({
      results: results?.map((e: any) => ({
        id: e.id,
      }))
    });
  }
);

export default router;
