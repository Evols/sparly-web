
import { arrEq, formEntriesDeepRebuild, IFormData, IFormEntryImg, solveFormMod } from '../common';
import express from 'express';
import { body } from 'express-validator';
import { db } from '../index';
import multer from 'multer';
import dataUriToBuffer from 'data-uri-to-buffer';
import AWS from 'aws-sdk';

const upload = multer({ limits: { fieldSize: 25 * 1024 * 1024 } });
const s3 = new AWS.S3({ region: 'eu-west-3' });

const photoBucket = 'clovercloudugc';

const router = express.Router();

router.get(
  '/',
  [],
  async function(req: express.Request, res: express.Response) {

    const userId = req.user.sub;
    const mongoUserRes = await db.collection('users').findOne({ id: userId });

    const website = mongoUserRes?.website;
    const domainname = mongoUserRes?.domainname;
    const awsData = mongoUserRes?.awsData;

    const ampAppId = awsData?.ampAppId;

    res.status(200).send({
      formData: JSON.parse(website?.formData ?? '{}'),
      presentation: JSON.parse(website?.presentation ?? '{}'),
      templateId: website?.templateId ?? null,
      type: website?.type ?? null,
      domainname: domainname ?? null, // This is here for ease reasons
      tempUrl: ampAppId ? `https://master.${ampAppId}.amplifyapp.com` : null,
    });

  }
);

// Updates the type
router.put(
  '/type',
  [
    body('type').isString().isLength({ min: 1, max: 50 }),
  ],
  async function(req: express.Request, res: express.Response) {

    const type = req.body.type;

    // Update in the server. This voids the template id, but not the form
    db.collection('users').findOneAndUpdate(
      {
        id: req.user.sub,
      },
      {
        '$set': {
          'website.type': type,
          'website.templateId': undefined,
        },
      },
      { upsert: true },
    );

    res.status(200).send({});

  }
);

// Updates the presentation
router.put(
  '/presentation',
  [
    body('name').isString().isLength({ min: 1, max: 500 }),
    body('description').isString().isLength({ min: 1, max: 1000 }),
    body('address').isString().isLength({ min: 1, max: 1000 }),
    body('cityAndCode').isString().isLength({ min: 1, max: 100 }),
    body('phoneNumber').isString().isLength({ min: 1, max: 50 }),
    body('emailAddress').isString().isLength({ min: 1, max: 500 }),
  ],
  async function(req: express.Request, res: express.Response) {

    const { name, description, address, cityAndCode, phoneNumber, emailAddress } = req.body;

    // Update in the server. This voids the template id, but not the form
    db.collection('users').findOneAndUpdate(
      {
        id: req.user.sub,
      },
      {
        '$set': {
          'website.presentation': JSON.stringify({ name, description, address, cityAndCode, phoneNumber, emailAddress }),
        },
      },
      { upsert: true },
    );

    res.status(200).send({});

  }
);

// Updates the template
router.put(
  '/template',
  [
    body('templateId').isString().isLength({ min: 1, max: 50 }),
  ],
  async function(req: express.Request, res: express.Response) {

    const templateId = req.body.templateId;

    // Fetch the template
    const mongoTemplateRes = await db.collection('templates').findOne({ id: templateId });
    if (mongoTemplateRes === null) {
      return res.status(400).end();
    }

    // Fetch the user
    const mongoUserRes = await db.collection('users').findOne({ id: req.user.sub });
    if (mongoUserRes === null) {
      return res.status(403).end();
    }

    // Ensure the template has the right type
    if (mongoTemplateRes.type !== mongoUserRes.website?.type) {
      return res.status(422).end();
    }

    // Transition the form data
    const oldFormData = JSON.parse(mongoUserRes?.website?.formData ?? '{}');
    const templateFormData = JSON.parse(mongoTemplateRes?.defaults);
    const solvedFormMod = solveFormMod(oldFormData, templateFormData, true);

    // Update in the server
    db.collection('users').findOneAndUpdate(
      {
        id: req.user.sub,
      },
      {
        '$set': {
          'website.templateId': req.body.templateId,
          'website.formData': JSON.stringify(solvedFormMod.formData),
        }
      },
    );

    res.status(200).send({
      formData: solvedFormMod.formData,
    });

  }
);

// Updates the form data
router.put(
  '/formData',
  upload.none(),
  async function(req: express.Request, res: express.Response) {

    const netFormData = req.body;
    const formData = JSON.parse(netFormData.body);

    // Fetch the user
    const mongoUserRes = await db.collection('users').findOne({ id: req.user.sub });
    if (mongoUserRes === null) {
      return res.status(403).end();
    }

    const oldFormData = mongoUserRes.website.formData as IFormData;
    const solvedFormMod = solveFormMod(oldFormData, formData, true);

    const bins = solvedFormMod.imagesToUpload.map(
      img => ({
        ...img,
        bin: dataUriToBuffer(netFormData[img.path]),
        contentType: netFormData[img.path].match(/^data:image\/[a-zA-Z0-9]+/g)![0].match(/image\/[a-zA-Z0-9]+$/g)![0],
      })
    );

    // Upload
    await Promise.all(bins.map(
      e => new Promise<void>(
        async resolve => {
          await s3.putObject({
            Bucket: photoBucket,
            Key: e.path,
            Body: e.bin,
            ContentType: e.contentType,
            GrantRead: 'uri=http://acs.amazonaws.com/groups/global/AllUsers'
          }).promise();
          resolve();
        }
      )
    ));

    const newForm = formEntriesDeepRebuild(solvedFormMod.formData, (k, v, fields) => {
      const found = solvedFormMod.imagesToUpload.find(e => arrEq(e.fields, [...fields, k]));
      if (found !== undefined && v.type === 'img') {
        return { 
          ...v,
          value: {
            ...(v.value),
            img_source: 'hosted',
          }
        };
      }
      return v;
    });

    // Update in the server. This voids the template id, but not the form
    db.collection('users').findOneAndUpdate(
      {
        id: req.user.sub,
      },
      {
        '$set': {
          'website.formData': JSON.stringify(newForm),
        },
      },
    );

    return res.status(200).send({});

  }
);

export default router;
