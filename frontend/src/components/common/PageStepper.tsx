import { Step, StepButton, Stepper } from '@material-ui/core';
import React from 'react';
import { BuilderActivePage, builderPages, pageIdx, WebsiteBuilderState } from 'state/websiteBuilderState';
interface IProps {
};
export function PageStepper({ }: IProps) {
  const {
    category,
    templateId,
    formData,
    currentPage,
    redirectTo,
  } = WebsiteBuilderState.useContainer();

  // If the builder page is null (ie no page index provided), redirect to the page we assume the user wants to go to
  let validatedUntil = 6;
  if (formData === null) {
    validatedUntil = 5;
  }
  if (templateId === null) {
    validatedUntil = 4;
  }
  if (templateId === null) {
    validatedUntil = 3;
  }
  if (category === null) {
    validatedUntil = 2;
  }

  function getStepperContent(step: BuilderActivePage | null) {
    switch (step) {
      case BuilderActivePage.Intro:
        return 'Introduction';
      case BuilderActivePage.TypeSelector:
        return 'Type d\'entreprise';
      case BuilderActivePage.Presentation:
        return 'Présentation de l\'entreprise';
      case BuilderActivePage.TemplateSelector:
        return 'Sélectionner le modèle';
      case BuilderActivePage.Form:
        return 'Construction du site';
      case BuilderActivePage.Uploader:
        return 'Mise en ligne';
      default:
        return '?';
    }
  }

  const activeStep = pageIdx(currentPage ?? BuilderActivePage.Intro);
  return (
    <Stepper activeStep={activeStep} style={{ backgroundColor: 'white'}}>
    {
      builderPages.map((builderPage, index) => {
      return (
        <Step key={builderPage}>
          <StepButton disabled={index > validatedUntil} onClick={() => redirectTo(builderPage)}>
            {getStepperContent(builderPage)}
          </StepButton>
        </Step>
      );
    })}
    </Stepper>
  );

}
