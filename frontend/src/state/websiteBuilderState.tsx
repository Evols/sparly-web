
import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { AppState } from 'state/appState';
import axios from 'axios';
import { PresentationDataType } from 'components/pages/form/WebBuilderTypes';
import { clamp, IFormData, IImgData, useAsyncEffect } from 'core/utils';
import { asMap } from 'object-array-methods';
import { v4 as uuid } from 'uuid';

export enum BuilderActivePage {
  Intro = 'Intro',
  TypeSelector = 'TypeSelector',
  Presentation = 'Presentation',
  TemplateSelector = 'TemplateSelector',
  Form = 'Form',
  Uploader = 'Uploader',
}

export const builderPages = [
  BuilderActivePage.Intro,
  BuilderActivePage.TypeSelector,
  BuilderActivePage.Presentation,
  BuilderActivePage.TemplateSelector,
  BuilderActivePage.Form,
  BuilderActivePage.Uploader,
]

export function pageIdx(page: BuilderActivePage): number {
  return builderPages.findIndex(e => e === page);
}

export const pathToBuilderPage = {
  '1': BuilderActivePage.Intro,
  '2': BuilderActivePage.TypeSelector,
  '3': BuilderActivePage.Presentation,
  '4': BuilderActivePage.TemplateSelector,
  '5': BuilderActivePage.Form,
  '6': BuilderActivePage.Uploader,
}

export function builderPageToPath(path: BuilderActivePage) {
  return Object.entries(pathToBuilderPage).find(e => e[1] === path)?.[0];
}

export function getPagePlusOffset(page: BuilderActivePage | null, offset: number) {
  if (page === null) {
    return null;
  }
  const idx = pageIdx(page);
  return builderPages[clamp(idx + offset, 0, builderPages.length)];
}

interface IInitialState {
}

function useWebsiteBuilderState(initialState: IInitialState = {}) {

  const [isLoaded, setIsLoaded] = useState(false);

  const [category, setCategory] = useState<null | string>(null);
  const [templateId, setTemplateId] = useState<null | string>(null);
  const [formData, setFormData] = useState<null | IFormData>(null); // The newline stuff has to be <br/>
  const [presentationData, setPresentationData] = useState<null | PresentationDataType>(null); // The newline stuff has to be <br/>

  const [isDomaineNameSet, setIsDomaineNameSet] = useState<null | boolean>(null);
  const [domaineName, setDomaineName] = useState<null | { hostname: string, tld: string }>(null);

  const [tempUrl, setTempUrl] = useState<null | string>(null);

  async function updateCategory(newCategory: string, callback?: () => void) {
    await axios.put(
      '/website/type',
      { type: newCategory },
    );
    setCategory(newCategory);
    setTemplateId(null);

    if (callback !== undefined) {
      callback();
    }
  }

  async function updateTemplate(newTemplateId: string, callback?: () => void) {

    const { formData: newFormData } = (await axios.put(
      '/website/template',
      { templateId: newTemplateId },
    )).data;

    setTemplateId(newTemplateId);
    setFormData(newFormData);

    if (callback !== undefined) {
      callback();
    }
  }

  function rebuildImmutRcs(cloverFormData: IFormData, sendableFormData: FormData): IFormData {
    return asMap(cloverFormData).map(function (k, v) {
      if (v.type === 'img' && v.value.img_source === 'file') {
        const file = '' + v.value.path;
        const fileName = uuid();
        sendableFormData.append(fileName, file);
        const value: IImgData = { img_source: 'file', path: fileName };
        return { ...v, value };
      }
      else if (v.type === 'array') {
        return { ...v, value: v.value.map(e => rebuildImmutRcs(e, sendableFormData)) };
      }
      return v;
    }).obj;
  }

  async function updateFormData(newFormData: IFormData, callback?: () => void) {

    let sendableFormData = new FormData();
    const builtFormData = rebuildImmutRcs(newFormData, sendableFormData);
    sendableFormData.append('body', JSON.stringify(builtFormData));

    await axios.put(
      '/website/formData',
      sendableFormData,
    );
    setFormData(newFormData);

    if (callback !== undefined) {
      callback();
    }
  }

  async function updatePresentationData(newPresentationData: PresentationDataType, callback?: () => void) {
    await axios.put(
      '/website/presentation',
      {
        name: newPresentationData.name,
        description: newPresentationData.description,
        address: newPresentationData.address,
        cityAndCode: newPresentationData.cityAndCode,
        phoneNumber: newPresentationData.phoneNumber,
        emailAddress: newPresentationData.emailAddress,
      },
    );
    setPresentationData(newPresentationData);

    if (callback !== undefined) {
      callback();
    }
  }

  async function updateDomainName(hostname: string, tld: string, callback?: () => void) {
    await axios.post(
      '/domainname',
      { hostname, tld },
    );
    setIsDomaineNameSet(true);
    setDomaineName({ hostname, tld });

    if (callback !== undefined) {
      callback();
    }
  }

  async function uploadWebsite(callback?: () => void) {
    const res = await axios.put('/publish');
    setTempUrl(res.data.tempUrl);

    if (callback !== undefined) {
      callback();
    }
  }

  const { canUseApp } = AppState.useContainer();

  useAsyncEffect(async () => {

    if (canUseApp) {

      const res = await axios.get('/website');
      const website = res.data;

      setCategory(website.type);
      setTemplateId(website.templateId);
      setFormData(website.formData);
      setPresentationData(website.presentation);

      setIsDomaineNameSet(website.domainname !== null);
      setDomaineName(website.domainname);

      setTempUrl(website.tempUrl);

      setIsLoaded(true);

    }

  }, [canUseApp]);


  // Page

  const [currentPage, setCurrentPage] = useState(null as null | BuilderActivePage);

  function redirectToPrev() {
    setRedirectTo(getPagePlusOffset(currentPage, -1));
  }

  function redirectToNext() {
    setRedirectTo(getPagePlusOffset(currentPage, +1));
  }

  function redirectTo(page: BuilderActivePage) {
    setRedirectTo(page);
  }


  // Redirection internal

  const [_redirectTo, setRedirectTo] = useState(null as null | BuilderActivePage);

  const redirectToPath = _redirectTo !== null ? '/builder/' + builderPageToPath(_redirectTo) : null;
  function onRedirected() {
    setRedirectTo(null);
  }


  // API
  return {
    isLoaded,
    category, updateCategory,
    templateId, updateTemplate,
    formData, updateFormData,
    presentationData, updatePresentationData,
    isDomaineNameSet, domainName: domaineName, updateDomainName,
    currentPage, setCurrentPage, redirectToPrev, redirectToNext,
    tempUrl, uploadWebsite,
    redirectToPath, onRedirected,
    redirectTo,
  };
}

export const WebsiteBuilderState = createContainer(useWebsiteBuilderState);
