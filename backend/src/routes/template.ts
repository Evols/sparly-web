
import express from 'express';
import { param } from 'express-validator';
import { db } from '../index';

const router = express.Router();

router.get(
  '/bytype/:type',
  [
    param('type').isString().isLength({ min: 1, max: 50 }),
  ],
  async function(req: express.Request, res: express.Response) {

    const { type } = req.params;

    const mongoRes = await db.collection('templates').find({ type }).toArray();
    const templates = mongoRes.map(e => ({
      id: e.id,
      name: e.name,
      screenshot: e.screenshot,
    }));

    res.status(200).send(templates);
  }
);

router.get(
  '/byid/:id',
  [
    param('id').isString().isLength({ min: 1, max: 50 }),
  ],
  async function(req: express.Request, res: express.Response) {

    const mongoRes = await db.collection('templates').findOne({ id: req.params.id });

    if (mongoRes == null) {
      return res.status(404).end();  
    }

    return res.status(200).send({
      page: mongoRes.page,
      name: mongoRes.name,
      type: mongoRes.type,
    });
  }
);

export default router;
