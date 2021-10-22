
import ejs from 'ejs';
import { asMap } from 'object-array-methods';

interface IEjsData {
  [x: string]: string | IEjsData[],
};

export interface IFormDataPath {
  fields: string[];
  path: string,
}

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

export interface IFormEntryArray {
  type: 'array',
  label: string,
  value: {
    [x: string]: IFormEntry,
  }[],
}

export type IFormEntry = IFormEntryString | IFormEntryImg | IFormEntryArray;
export interface IFormData {
  [x: string]: IFormEntry,
}

export function formDataToEjsData(formData: IFormData): IEjsData {
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
      else if (v.value.img_source === 'unsplash') {
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
          e => `<a href="https://unsplash.com/@${encodeURI(e.authorUsername)}" target="_blank">${e.authorName.replace(/[^\w. ]/gi, '')}</a>`
        ).join(', ')
      } sur <a href="https://unsplash.com/">Unsplash</a>`
    };
  }

  return { unsplash_credits: '' };
}

export function ejsRender(template: string, formData: IFormData, presentationData: any) {

  const inputData = {
    ...formDataToEjsData(formData),
    ...computeUnsplashCredits(formData),
    head_title: formData.title.value + ' - ' + formData.subtitle.value,
    location_title: 'Où nous trouver ?',
    location_place: presentationData?.address,
    location_city: presentationData?.cityAndCode,
    location_phone: presentationData?.phoneNumber,
    location_phone_link: presentationData?.phoneNumber,
  };

  return ejs.render(template ?? '', inputData);
};

function formEntriesDeepForeach(entries: IFormData, iterator: (k: string, v: IFormEntry, fields: string[]) => void, fields?: string[]) {
  const actualFields = fields ?? [];
  asMap(entries).foreach((k, v) => {
    iterator(k, v, actualFields);
    if (v.type === 'array') {
      v.value.forEach((e, i) => formEntriesDeepForeach(e, iterator, [ ...actualFields, k, `${i}` ]));
    }
  });
}

export function formEntriesDeepRebuild(entries: IFormData, builder: (k: string, v: IFormEntry, fields: string[]) => IFormEntry, fields?: string[]): IFormData {
  const actualFields = fields ?? [];
  return asMap(entries).map((k, v) => {
    let nV = builder(k, v, actualFields);
    if (nV.type === 'array') {
      nV = { ...nV, value: nV.value.map((e, i) => formEntriesDeepRebuild(e, builder, [ ...actualFields, k, `${i}` ])) };
    }
    return nV;
  }).obj;
}

export function arrEq<T>(arr1: T[], arr2: T[]): boolean {
  return arr1.length === arr2.length && arr1.reduce<boolean>((acc, v, i) => acc && v === arr2[i], true);
}

function getFormEntryFromFields(form: IFormData, fields: string[]): IFormEntry | undefined  {
  if (fields.length <= 0) {
    return undefined;
  }
  const fieldAt = form[fields[0]];
  if (fieldAt.type === 'array') {
    if (fields.length <= 1) {
      return getFormEntryFromFields(fieldAt.value[parseInt(fields[1])], fields.slice(2));
    }
  }
  return fieldAt;
}

// Returns the new form data when, for a given form data, the template changes
// This does NOT handle deep form modifications (except for image hosting/removal, which is handled even at deep levels)
export function solveFormMod(oldFormData: IFormData, newFormData: IFormData, newIsTemplate: boolean = false): { formData: IFormData, imagesToUpload: IFormDataPath[], imagesToRemove: string[] } {

  // If newIsTemplate is true, it means that newFormData shouldn't be used to override the fields that already have a value

  // Entries that are in the new form, but whose keys are aren't in the old one
  const outerNewEntries = asMap(newFormData).filter(newKey => asMap(oldFormData).find(oldKey => newKey === oldKey) === undefined);

  // Compute the images to upload
  let imagesToUpload: IFormDataPath[] = [];
  formEntriesDeepForeach(newIsTemplate ? outerNewEntries.obj : newFormData, (k, v, fields) => {
    if (v.type === 'img' && v.value.img_source === 'file') {
      imagesToUpload.push({ fields: [ ...fields, k ], path: v.value.path });
    }
  });

  // Compute the images to remove
  let imagesToRemove: string[] = [];
  formEntriesDeepForeach(oldFormData, (kOld, vOld) => {
    if (vOld.type === 'img' && vOld.value.img_source === 'file') {
      const path = vOld.value.path;
      let found = false;
      formEntriesDeepForeach(newFormData, (kNew, vNew) => {
        if (vNew.type === 'img' && vNew.value.img_source === 'file' && vOld.value.path === path) {
          found = true;
        }
      });
      if (!found) {
        imagesToRemove.push(path);
      }
    }
  });

  // Solve the form
  const solvedFormData = !newIsTemplate
  ? newFormData
  : {
    ...asMap(newFormData).filter((kOld) => asMap(oldFormData).find((kNew) => kOld === kNew) !== undefined).obj,
    ...outerNewEntries.obj,
  };

  return {
    formData: solvedFormData,
    imagesToUpload,
    imagesToRemove,
  };
}
