
import { Button, MenuItem, Select, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import ejs from 'ejs';
import axios from 'axios';

import { ejsRender, useAsyncEffect } from 'core/utils';
import { WebsiteBuilderState } from 'state/websiteBuilderState';
import { PageStepper } from 'components/common/PageStepper';
import { FakeBrowser } from 'components/common/FakeBrowser';
import LogoutButton from 'components/common/LogoutButton';

import './UploadPage.css';

interface IProps {
};

export function UploadPage({ }: IProps) {
  const {
    formData, templateId, presentationData,
    domainName: savedDomainName, isDomaineNameSet, updateDomainName,
    tempUrl, uploadWebsite,
    redirectToPrev,
  } = WebsiteBuilderState.useContainer();

  const [templateContent, setTemplateContent] = useState(null as null | string);
  useAsyncEffect(async () => {
    if (templateId !== null) {
      const res = await axios.get(`/template/byid/${templateId}`);
      setTemplateContent(res.data.page);
    }
  }, [templateId]);

  const [domainName, setDomainName] = useState(null as null | { hostname: string, tld: string });
  useEffect(function() {
    if (!isDomaineNameSet) {
      setDomainName({
        hostname: 'votre-site',
        tld: 'fr',
      });
    } else {
      setDomainName(savedDomainName);
    }
  }, [savedDomainName, isDomaineNameSet]);

  const [domainAvailable, setDomainAvailable] = useState(null as null | boolean);
  async function fetchDomainAvailability() {
    const res = await axios.get(`/domainname/available?hostname=${domainName?.hostname}&tld=${domainName?.tld}`);
    setDomainAvailable(res.data.available);
  }

  const rendered =
    (templateContent != null && formData != null)
    ? ejsRender(templateContent, formData, presentationData)
    : '';
  
  return <>

    <PageStepper />
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <div style={{ flex: 1 }} />
        <div className="main-text-container-form">
          <h1 className="introduction-text-h1">Mise en ligne du site</h1>
          <p className="main-text-container-p">
            Votre site est enfin prêt à être mis en ligne !
            Si vous voulez le modifier, n'hésitez pas à revenir aux étapes précédentes.
            Vous pouvez toujours le modifier après l'avoir mis en ligne.
          </p>
          {
            !isDomaineNameSet
            ? <>
              <h2 className="introduction-text-h2">Une dernière chose</h2>
              <p className="main-text-container-p">
                Avant de lancer votre site, vous devez choisir le nom qui apparaîtra dans la barre d'adresse (appelé nom de domaine).
                Faites bien attention en le choisissant, vous ne pourrez plus le modifier ensuite.
              </p>
              <p className="main-text-container-p">
                Il se peut que le nom de domaine que vous choisissez soit déjà pris.
                Vous devez donc vérifier que le nom de domaine est libre, en cliquant sur "Vérifier la disponibilité".
                Une fois que cette vérification sera faite, vous pourrez définir le nom de domaine.
              </p>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div className="text-field-input-domain">
                  <TextField
                    value={domainName?.hostname ?? ''}
                    onChange={e => {
                      setDomainAvailable(null);
                      setDomainName({ tld: '', ...domainName, hostname: e.target.value });
                    }}
                    placeholder="votre-site"
                  />
                  &nbsp;

                  <Select
                    value={domainName?.tld ?? ''}
                    onChange={e => {
                      setDomainAvailable(null);
                      setDomainName({ hostname: '', ...domainName, tld: e.target.value as string });
                    }}
                  >
                    <MenuItem value="fr">.fr</MenuItem>
                    <MenuItem value="com">.com</MenuItem>
                    <MenuItem value="eu">.eu</MenuItem>
                  </Select>
                </div>

                &nbsp;&nbsp;&nbsp;

                <div className="fetch-domain-availiability-button">
                  <Button
                    color="primary"
                    onClick={fetchDomainAvailability}
                    disabled={domainAvailable !== null}
                  >
                    {
                      domainAvailable === true ? 'Ce domaine est disponible' :
                      domainAvailable === false ? 'Ce domaine n\'est pas disponible' :
                      'Vérifier la disponibilité'
                    }
                  </Button>
                </div>

              </div>

              <p className="main-text-container-p">
                Votre site sera alors accessible à l'adresse https://{domainName?.hostname}.{domainName?.tld}/.
              </p>

              <div className="updateDomainName-container">
                <button className="main-button-presentation-page update-domain-name-button"
                  onClick={() => updateDomainName(domainName?.hostname!, domainName?.tld!)}
                >
                  Définir le nom de domaine
                </button>
              </div>
            </>

            : <>
              <p>
                Votre site sera accessible à l'adresse https://{savedDomainName?.hostname}.{savedDomainName?.tld}/.
              </p>
            </>
          }

        </div>
        <div style={{ flex: 1 }} />
      </div>


      {/* Browser */}

      <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <div style={{ flex: 1 }} />
        <div className="iframe-window-website">

          <div>
            <FakeBrowser
              currentAddress={`http://${domainName?.hostname}.${domainName?.tld}/`}
            >
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '0 0 10px 10px', maxHeight: '100vh', height: '100vh' }}>

                <div style={{ zoom: '78%', width: '100%', height: '100%', }}>

                  <iframe srcDoc={rendered} style={{ width: '100%', height: '100%', border: 'none', }} />

                </div>

              </div>
            </FakeBrowser>
          </div>

        </div>
        <div style={{ flex: 1 }} />
      </div>


      {/* After browser */}

      <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <div style={{ flex: 1 }} />
        <div style={{ maxWidth: '800px', width: '100%', textAlign: 'left', paddingTop: '20px' }}>

          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <button className="main-button-presentation-page upload-website-button" onClick={() => uploadWebsite()}>Mettre en ligne le site</button>&nbsp;&nbsp;
            <div>
              <button className="edit-website-button" onClick={redirectToPrev}>Editer le site web</button>&nbsp;&nbsp;
            </div>
          </div>
          { tempUrl
            ? <p>
                Si votre site n'est pas accessible via le nom de domaine plus haut, vous pouvez y accéder via l'adresse suivante:<br/>
                <a href={tempUrl} target="_blank">{tempUrl}</a>
              </p>
            : <></>
          }
        </div>
        <div style={{ flex: 1 }} />
      </div>
      <LogoutButton></LogoutButton>
    </div>
  </>;
}
