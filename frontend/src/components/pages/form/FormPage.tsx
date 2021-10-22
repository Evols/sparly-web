
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Grid, Button } from '@material-ui/core';
import axios from 'axios';

import './FormPage.css';
import { WebBuilder } from './WebBuilder';
import { WebsiteBuilderState } from 'state/websiteBuilderState';
import { brifyObject, ejsRender, unbrifyObject, useAsyncEffect } from 'core/utils';
import { PageStepper } from 'components/common/PageStepper';

import { v4 as uuid } from 'uuid';
import $ from 'jquery';

interface IProps {
}

export function FormPage({ }: IProps) {

  const {
    formData: savedFormData, updateFormData,
    templateId, presentationData,
    redirectToPrev, redirectToNext
  } = WebsiteBuilderState.useContainer();

  const [formData, setFormData] = useState(savedFormData!);
  useEffect(() => {
    setFormData(savedFormData!);
  }, [savedFormData]);

  const [templateContent, setTemplateContent] = useState(null as null | string);
  useAsyncEffect(async () => {
    if (templateId !== null) {
      const res = await axios.get(`/template/byid/${templateId}`);
      setTemplateContent(res.data.page);
    }
  }, [templateId]);

  const fullyLoaded = templateContent != null && formData != null;

  const rendered =
    (templateContent != null && formData != null)
    ? ejsRender(templateContent, formData, presentationData)
    : '';

  const [scrollY, setScrollY] = useState(0);
  useLayoutEffect(() => {
    if (iframeRendererRef.current?.contentWindow) {
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          let iframeWindow = iframeRendererRef.current?.contentWindow;
          if (iframeWindow) {
            $(iframeWindow).scrollTop(scrollY);
          }
        }, 800 * Math.pow(2, -i));
      }
    }
  }, [rendered]); 

  const iframeRendererRef = useRef<HTMLIFrameElement>(null);
  useLayoutEffect(() => {
    let iframeWindow = iframeRendererRef.current!.contentWindow!;
    setTimeout(() => {
      $(iframeWindow).on('scroll', e => {
        setScrollY(iframeWindow.scrollY);
      });
    }, 800);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>

      <PageStepper />

      <Grid container spacing={0}>

        <Grid item xs={12} md={4}>
          <div style={{ alignContent: 'left', textAlign: 'left', paddingLeft: '20px', paddingRight: '20px', paddingTop: '0px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 72px)', overflowY: 'scroll' }}>
            <div style={{ flex: 1 }}>
            {
              !fullyLoaded
              ? <React.Fragment />
              : <WebBuilder
                formData={unbrifyObject(formData)!}
                setFormData={x => { setFormData(brifyObject(x)); }}
              />
            }
            </div>

            <div style={{ padding: '20px 0', justifyContent: 'space-between', display: 'flex', flexDirection: 'row' }}>

              <div style={{ textAlign: 'left' }}>
                <Button variant="contained" color="default" onClick={redirectToPrev}>Changer de modèle</Button>&nbsp;&nbsp;
              </div>

              <div style={{ textAlign: 'right' }}>
                <Button variant="contained" color="primary" onClick={() => updateFormData(formData, redirectToNext)}>Etape suivante</Button>
              </div>

            </div>

          </div>
        </Grid>

        <Grid item xs={12} md={8}>
          <div style={{ height: 'calc(100vh - 72px)' }} >
            <iframe ref={iframeRendererRef} srcDoc={rendered} style={{ width: '100%', height: '100%', border: 'none', }} />
          </div>
        </Grid>

      </Grid>
    </div>
  );
}
