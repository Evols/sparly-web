
import { minEz } from './utils';
import * as fs from 'fs';
import { Db, MongoClient } from 'mongodb';

import { initEnv } from './env';

export let mongoClient: MongoClient;
export let db: Db;

async function run() {

  console.log('Starting seed...');

  await initEnv();

  console.log('Env loaded');

  mongoClient = new MongoClient(process.env.MONGO_URI!, { useUnifiedTopology: true, useNewUrlParser: true });
  await mongoClient.connect();

  console.log('Connected to Mongo database');

  db = mongoClient.db('cloverweb');

  const baseDir = './seeding';
  const allTemplates = fs.readdirSync(baseDir).reduce<any[]>((acc, dirName) => {

    const fileLoc = baseDir + '/' + dirName;
    if (fs.lstatSync(fileLoc)) {

      let infoContent, ejsContent;
      try {
        infoContent = fs.readFileSync(fileLoc + '/' + 'info.json')?.toString();
        ejsContent = fs.readFileSync(fileLoc + '/' + 'page.ejs')?.toString();
      } catch (err) {
        if (!infoContent) {
          console.error('No info.json for', dirName);
        }
        else if (!ejsContent) {
          console.error('No page.ejs for', dirName);
        }
        return acc;
      }

      const infoParsed = JSON.parse(infoContent);
      const pageMinified = minEz(ejsContent);
      return [ ...acc, {
        ...infoParsed,
        defaults: JSON.stringify(infoParsed.defaults),
        page: pageMinified,
      }];

    }
    return acc;

  }, []);

  await db.collection('templates').deleteMany({});
  await db.collection('templates').insertMany(allTemplates);

  await db.collection('users').deleteMany({ id: 'auth0|5fd15ccc4d6e5b006cf30d5b' });
  await db.collection('users').insertMany([
    {
      id: 'auth0|5fd15ccc4d6e5b006cf30d5b',
      website: {
        type: 'restaurant',
        presentation: '{"name":"a","description":"a","address":"a","cityAndCode":"a","phoneNumber":"a","emailAddress":"a"}',
      }
    }
  ]);

  mongoClient.close();

  console.log('All done!');

}

run();
