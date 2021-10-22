
import express from 'express';
import AWS from 'aws-sdk';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

const AdmZip = require('adm-zip-node');

import { db } from '../index';
import { ejsRender } from '../common';


export const amplify = new AWS.Amplify({ region: 'eu-west-3' });

// Returns ampAppId
export async function getOrSpawnAmplify(mongoUserRes: any): Promise<string> {

  const website = mongoUserRes?.website;
  const presentationData = JSON.parse(website?.presentation);
  const awsData = mongoUserRes?.awsData;

  // Get the app id, or create a new app
  let ampAppId = awsData?.ampAppId as undefined | string;
  if (ampAppId == null) {
    
    // No need for a crypto random, just enough to identify it internally
    const name = presentationData.name.replace(/[^a-zA-Z0-9]/, '_') + '_' + uuid();

    const createdAppRes = await amplify.createApp({ name }).promise();
    ampAppId = createdAppRes.app.appId;
    await amplify.createBranch({ appId: ampAppId, branchName: 'master' }).promise();

    await db.collection('users').findOneAndUpdate(
      {
        id: mongoUserRes.id,
      },
      {
        '$set': {
          'awsData.ampAppId': ampAppId,
          'awsData.name': name,
        },
      },
    );
  }
  return ampAppId;
}

const router = express.Router();

router.put(
  '/',
  [],
  async function(req: express.Request, res: express.Response) {

    // Get user from mongo, and some relevant informations
    const mongoUserRes = await db.collection('users').findOne({ id: req.user.sub });

    // Create or get Amplify app id
    const ampAppId = await getOrSpawnAmplify(mongoUserRes);

    const website = mongoUserRes?.website;
    const templateId = website?.templateId ?? null;

    const formData = JSON.parse(website?.formData);
    const presentationData = JSON.parse(website?.presentation);

    // Get template from mongo
    const getTemplateRes = await db.collection('templates').findOne({id: templateId});
    const templateContent = getTemplateRes.page;

    // Render the template using ejs
    const rendered = ejsRender(templateContent ?? '', formData, presentationData);

    const cdRes = (await amplify.createDeployment({
      appId: ampAppId,
      branchName: 'master',
    }).promise());

    // Zip the file
    let zip = new AdmZip();
    zip.addFile('index.html', Buffer.alloc(rendered.length, rendered));
    const zipContent: Buffer = zip.toBuffer();

    await axios.put(cdRes.zipUploadUrl, zipContent, { headers: { 'Content-Type': 'application/zip' }});
    await amplify.startDeployment({ appId: ampAppId, branchName: 'master', jobId: cdRes.jobId }).promise();

    return res.status(200).send({
      tempUrl: `https://master.${ampAppId}.amplifyapp.com`,
    });

  }
);

export default router;
