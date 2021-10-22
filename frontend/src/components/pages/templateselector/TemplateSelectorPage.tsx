
import React, { useEffect, useState } from 'react';
import { Grid, Button } from '@material-ui/core';

import './TemplateSelectorPage.css';
import axios from 'axios';
import { WebsiteBuilderState } from 'state/websiteBuilderState';
import { useAsyncEffect } from 'core/utils';
import { PageStepper } from 'components/common/PageStepper';

interface IProps {
}

export function TemplateSelector({ }: IProps) {
  const {
    templateId: savedTemplateId, updateTemplate,
    category,
    redirectToPrev, redirectToNext,
  } = WebsiteBuilderState.useContainer();

  const [templateId, setTemplateId] = useState(savedTemplateId);
  useEffect(() => {
    setTemplateId(savedTemplateId);
  }, [savedTemplateId]);

  const [templates, setTemplates] = useState(undefined as any[] | undefined);
  useAsyncEffect(async () => {
    setTemplates((await axios.get(`/template/bytype/${category}`)).data);
  }, []);


  return <>

    <PageStepper />
    <div className="selector-container-h1">
      <h1 className="selector-h1">Sélectionnez un type modèle</h1>
    </div>
    <div style={{maxWidth: 1200, margin: '0 auto'}}>
      <Grid container spacing={2}>
      {
        (templates ?? []).map((e: any) => (
          <Grid xs={12} sm={6} md={4} item={true} key={e.id}>
            <button className="container-template-image-selector">
              <img src="https://cloverstatic.s3.eu-west-3.amazonaws.com/web-browser-image-sitebuilder.svg" className="navbar-illustration-site-builder" onClick={() => setTemplateId(e.id)}/>
              <img className="selector-template-image" src={e.screenshot} onClick={() => setTemplateId(e.id)}/>
            </button>
            {e.id === templateId ? <div className="select-label-container">Sélectionné</div>:''}
          </Grid>
        ))
      }
      </Grid>
      <div className="main-button-container">
        <div className="main-button-margin">
          <button className="main-button-in-left" onClick={redirectToPrev}>Étape précédente</button>&nbsp;&nbsp;
        </div>
        <div className="main-button-margin">
          <button className="main-button-in-right" disabled={templateId === null} onClick={() => updateTemplate(templateId!, redirectToNext)}>Étape suivante</button>
        </div>
      </div>
    </div>
  </>;
}
