
import * as Crypto from 'crypto';
import { LoremIpsum } from "lorem-ipsum";
import { asMap } from 'object-array-methods';
import { useEffect } from 'react';
import ejs from 'ejs';

export const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

export function genRandomString(bytes: number): Promise<string> {
  return new Promise(resolve => Crypto.randomBytes(bytes, (err, buf) => resolve(buf.toString('base64'))));
}

export function ezWaiter(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

declare global {
  interface Array<T> {
    upsert(finder: (x: T) => boolean, create: () => T): T;
  }
}

if (!Array.prototype.upsert) {
  Array.prototype.upsert = function<T>(this: T[], finder: (x: T) => boolean, create: () => T): T {
    let found = this.find(finder);
    if (found === undefined) {
      const i = this.push(create());
      found = this[i - 1];
    }
    return found;
  }
}

export function clamp(x: number, min: number, max: number): number {
  return Math.min(Math.max(x, min), max);
}

export function useAsyncEffect(func: () => Promise<any>, capture: any[], dispose?: () => any) {
  useEffect(() => {
    func();
    if (dispose !== undefined) {
      return dispose();
    }
  }, capture);
}

export function brifyObject<T>(value: T): T {

  if (Array.isArray(value)) {
    // @ts-ignore
    return value.map(e => brifyObject(e)) as unknown as T;
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(
        e => [
          e[0],
          brifyObject(e[1]),
        ],
      )
    ) as unknown as T;
  }
  if (typeof value === 'string') {
    return (value as unknown as string).replace(/((\n)|(\r\n))/g, '<br/>') as unknown as T;
  }
  return value;
}

export function unbrifyObject<T>(value: T): T {

  if (Array.isArray(value)) {
    // @ts-ignore
    return value.map(e => unbrifyObject(e)) as unknown as T;
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(
        e => [
          e[0],
          unbrifyObject(e[1]),
        ],
      )
    ) as unknown as T;
  }
  if (typeof value === 'string') {
    return (value as unknown as string).replace(/<br\/>/g, '\r\n') as unknown as T;
  }
  return value;
}


interface IEjsData {
  [x: string]: string | IEjsData[],
};

export interface IFormEntryString {
  type: 'string',
  label: string,
  value: string,
}

export interface IImgDataNoUnsplash {
  img_source: 'file' | 'hosted' | 'url',
  path: string, // If img_source is 'file', then path is the base64 string for it
}

export interface IImgDataUnsplash {
  img_source: 'unsplash',
  path: string,
  authorName: string;
  authorUsername: string,
}

export type IImgData = IImgDataNoUnsplash | IImgDataUnsplash;

export interface IFormEntryImg {
  type: 'img',
  label: string,
  value: IImgData,
}

export interface IFormEntryTitle {
  type: 'title',
  label: string,
}

export interface IFormEntryArray {
  type: 'array',
  label: string,
  default: IFormEntry,
  value: {
    [x: string]: IFormEntry,
  }[],
}

export type IFormEntryEditable = IFormEntryString | IFormEntryImg | IFormEntryArray;
export type IFormEntry = IFormEntryEditable | IFormEntryTitle;
export interface IFormData {
  [x: string]: IFormEntry,
}

function formEntriesDeepForeach(entries: IFormData, iterator: (k: string, v: IFormEntry, fields: string[]) => void, fields?: string[]) {
  const actualFields = fields ?? [];
  asMap(entries).foreach((k, v) => {
    iterator(k, v, actualFields);
    if (v.type === 'array') {
      v.value.forEach((e, i) => formEntriesDeepForeach(e, iterator, [ ...actualFields, k, `${i}` ]));
    }
  })
}

export function formDataToEjsData(formData: { [x: string]: IFormEntry }): IEjsData {
  return asMap(formData).map((k, v) => {

    // Case string
    if (v.type === 'string') {
      return v.value as string;
    }

    // Case image
    if (v.type === 'img') {
      if (v.value.img_source === 'hosted') {
        return `https://clovercloudugc.s3.amazonaws.com/${v.value.path}`;
      }
      if (v.value.img_source === 'unsplash') {
        return `https://source.unsplash.com/${v.value.path}`;
      }
      else {
        return v.value.path as string;
      }
    }

    // Case array
    if (v.type === 'array') {
      return v.value.map(e => formDataToEjsData(e));
    }

    return '';
  }).obj;
}

export function computeUnsplashCredits(formData: IFormData): IEjsData {
  let unsplashImages: IImgDataUnsplash[] = [];
  formEntriesDeepForeach(formData, (k, v) => {
    if (v.type === 'img' && v.value.img_source === 'unsplash') {
      unsplashImages.push(v.value);
    }
  });

  if (unsplashImages.length > 0) {
    return { unsplash_credits:
      `Photos par ${
        unsplashImages.map(
          e => `<a href="https://unsplash.com/@${encodeURI(e.authorUsername)}?utm_source=sparly&utm_medium=referral" target="_blank">${e.authorName.replace(/[^\w. ]/gi, '')}</a>`
        ).join(', ')
      } sur <a href="https://unsplash.com/?utm_source=sparly&utm_medium=referral">Unsplash</a>`
    };
  }

  return { unsplash_credits: '' };
}

export function ejsRender(template: string, formData: IFormData, presentationData: any) {

  const inputData = {
    ...formDataToEjsData(formData),
    ...computeUnsplashCredits(formData),
    head_title: (formData.title as IFormEntryString).value + ' - ' + (formData.subtitle as IFormEntryString).value,
    location_title: 'Où nous trouver ?',
    location_place: presentationData?.address,
    location_city: presentationData?.cityAndCode,
    location_phone: presentationData?.phoneNumber,
    location_phone_link: presentationData?.phoneNumber,
  };

  return ejs.render(template ?? '', inputData);
};
