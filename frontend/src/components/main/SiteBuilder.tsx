
import { IntroPage } from 'components/pages/intro/IntroPage';
import { TemplateSelector } from 'components/pages/templateselector/TemplateSelectorPage';
import { TypeSelectorPage } from 'components/pages/typeselector/TypeSelectorPage';
import { UploadPage } from 'components/pages/upload/UploadPage';
import { FormPage } from 'components/pages/form/FormPage';
import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { WebsiteBuilderState, BuilderActivePage, pageIdx } from 'state/websiteBuilderState';
import { PresentationPage } from 'components/pages/presentation/PresentationPage';

import './SiteBuilder.css';

interface IProps {
  builderPage: null | BuilderActivePage,
};

export function SiteBuilder({ builderPage }: IProps) {

  const {
    category,
    templateId,
    presentationData,
    formData,
    redirectToPath,
    onRedirected,
    setCurrentPage,
  } = WebsiteBuilderState.useContainer();

  useEffect(() => {
    setCurrentPage(builderPage);
  }, [builderPage]);

  useEffect(() => {
    if (redirectToPath !== null) {
      onRedirected();
    }
  }, [redirectToPath]);

  // If the builder page is null (ie no page index provided), redirect to the page we assume the user wants to go to
  if (builderPage === null) {
    // If no company category, go to the intro
    if (category === null) {
      return <Redirect to='/builder/1' />;
    }
    // If no presentation data, go to the presentation page
    if (presentationData === null) {
      return <Redirect to='/builder/3' />;
    }
    // If no template, go to the template selection page
    else if (templateId === null) {
      return <Redirect to='/builder/4' />;
    }
    // If no form data, go to the form page
    else if (formData === null) {
      return <Redirect to='/builder/5' />;
    }
    // If all set, go to the upload page
    return <Redirect to='/builder/6' />;
  }

  const builderPageIdx = pageIdx(builderPage);

  // Check that the user can access the given page. If he can't redirect him to the no-page, where he will be redirected to a page he can access
  if (
    (builderPageIdx > pageIdx(BuilderActivePage.TypeSelector) && category == null) ||
    (builderPageIdx > pageIdx(BuilderActivePage.Presentation) && presentationData == null) ||
    (builderPageIdx > pageIdx(BuilderActivePage.TemplateSelector) && templateId == null) ||
    (builderPageIdx > pageIdx(BuilderActivePage.Form) && formData == null)
  ) {
    return <Redirect to='/builder' />;
  }

  // If internal needs to redirect, do so
  if (redirectToPath !== null) {
    return <Redirect to={redirectToPath} />;
  }

  switch (builderPage) {
    case BuilderActivePage.Intro:
      return <IntroPage />;
    case BuilderActivePage.TypeSelector:
      return <TypeSelectorPage />;
    case BuilderActivePage.Presentation:
      return <PresentationPage />;
    case BuilderActivePage.TemplateSelector:
      return <TemplateSelector />;
    case BuilderActivePage.Form:
      return <FormPage />;
    case BuilderActivePage.Uploader:
      return <UploadPage />;
  }
}
