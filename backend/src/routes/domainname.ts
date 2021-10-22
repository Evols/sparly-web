
import express from 'express';
import { body, query } from 'express-validator';
import AWS from 'aws-sdk';

import { db } from '../index';
import { getOrSpawnAmplify } from './publish';

const ses = new AWS.SES({ region: 'eu-west-3' });

export const route53Domains = new AWS.Route53Domains({ region: 'us-east-1' }); // The Route53Domains thing is only available in the us east 1 zone

const router = express.Router();

// Gets whether a domain name is available
router.get(
  '/available',
  [
    query('hostname').isString().isLength({ min: 1, max: 255 }),
    query('tld').isString().isIn([ 'fr', 'com', 'eu', 'uk', 'co.uk', 'us', 'ca', 'be', 'cz', 'es', 'fi', 'it' ]),
  ],
  async function(req: express.Request, res: express.Response) {

    const { hostname, tld } = req.query;
    const domain = hostname + '.' + tld;

    const availabilityRes = await route53Domains.checkDomainAvailability({
      DomainName: domain,
    }).promise();

    return res.status(200).send({ available: availabilityRes.Availability === 'AVAILABLE' });

  }
);

// Gets the user's domain name
router.get(
  '/',
  [
    query('hostname').isString().isLength({ min: 1, max: 255 }),
    query('tld').isString().isIn([ 'fr', 'com', 'eu', 'uk', 'co.uk', 'us', 'ca', 'be', 'cz', 'es', 'fi', 'it' ]),
  ],
  async function(req: express.Request, res: express.Response) {

    // Fetch the user
    const mongoUserRes = await db.collection('users').findOne({ id: req.user.sub });

    // If there's a domain name, return it
    const domainname = mongoUserRes?.domainname;
    if (domainname == null) {
      return res.status(200).send({
        tld: domainname.tld,
        hostname: domainname.hostname,
      });
    }

    // If there's none, return empty
    return res.status(204).end();

  }
);

// Update the domain name
router.post(
  '/',
  [
    body('hostname').isString().isLength({ min: 1, max: 255 }),
    body('tld').isString().isIn([ 'fr', 'com', 'eu' ]),
  ],
  async function(req: express.Request, res: express.Response) {

    const { hostname, tld } = req.body;
    const domain = hostname + '.' + tld;

    // Fetch the user
    const mongoUserRes = await db.collection('users').findOne({ id: req.user.sub });

    // If there's a domain name, the user has already set it, and can't set it again
    if (mongoUserRes?.domainname != null) {
      return res.status(403).end();
    }

    // Update in the server. This voids the template id, but not the form
    db.collection('users').findOneAndUpdate(
      {
        id: req.user.sub,
      },
      {
        '$set': {
          'domainname.hostname': hostname,
          'domainname.tld': tld,
        },
      },
      { upsert: true },
    );

    const ampAppId = await getOrSpawnAmplify(mongoUserRes);
    const mongoUserRes2 = await db.collection('users').findOne({ id: req.user.sub });

    await ses.sendEmail({
      Source: 'hutteau.b@gmail.com',
      Destination: {
        ToAddresses: ['hutteau.b@gmail.com', 'louis687.naudet@icloud.com', 'leo.arsenin@utt.fr'],
      },
      Message: {
        Subject: {
          Data: `Domaine ${domain} pour ${ampAppId} (id: ${mongoUserRes.id})`,
        },
        Body: {
          Text: {
            Data: `Domaine ${domain} pour ${ampAppId} (id: ${mongoUserRes.id}). Nom: ${mongoUserRes2.awsData.name}`,
          },
        }
      }
    }).promise();

    return res.status(204).end();

  }
);

export default router;
