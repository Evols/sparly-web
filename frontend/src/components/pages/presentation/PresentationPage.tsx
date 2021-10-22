
import React, { useEffect, useState } from 'react';
import { TextField } from '@material-ui/core';
import './PresentationPage.css';
import { WebsiteBuilderState } from 'state/websiteBuilderState';
import { PageStepper } from 'components/common/PageStepper';
import { brifyObject, unbrifyObject } from 'core/utils';

interface IProps {
}

export function PresentationPage({ }: IProps) {
  const {
    presentationData: inPresentationData, updatePresentationData,
    redirectToPrev, redirectToNext,
  } = WebsiteBuilderState.useContainer();

  const presentationData = unbrifyObject(inPresentationData);
  const [name, setName] = useState(null as null | string);
  const [description, setDescription] = useState(null as null | string);
  const [address, setAddress] = useState(null as null | string);
  const [cityAndCode, setCityAndCode] = useState(null as null | string);
  const [phoneNumber, setPhoneNumber] = useState(null as null | string);
  const [emailAddress, setEmailAddress] = useState(null as null | string);

  useEffect(() => {
    if (presentationData !== null) {
      setName(presentationData.name);
      setDescription(presentationData.description);
      setAddress(presentationData.address);
      setCityAndCode(presentationData.cityAndCode);
      setPhoneNumber(presentationData.phoneNumber);
      setEmailAddress(presentationData.emailAddress);
    }
  }, [inPresentationData]);

  const canAdvance =
    (name ?? '').length > 0 &&
    (description ?? '').length > 0 &&
    (address ?? '').length > 0 &&
    (cityAndCode ?? '').length > 0 &&
    (phoneNumber ?? '').length > 0 &&
    (emailAddress ?? '').length > 0;

  return <>

    <PageStepper />
    <div>
      <div style={{ flex: 1 }} />
      <div className="main-text-container">
        <div>
          <h1 className="introduction-text-h1">Présentation de votre entreprise</h1>
          <p className="main-text-container-p">Aidez-nous à vous connaitre afin d'optimiser au mieux les données relatives à votre site.<br />Ces informations seront affichées sur le site.</p>
          <div className="textfield" style={{ width: '280px'}}>
            <TextField label="Nom de l'entreprise" value={name ?? ''} onChange={e => setName(e.target.value)} fullWidth />
          </div>
          <div className="textfield">
            <TextField label="Que proposez-vous en quelques mots ?" value={description ?? ''} multiline rowsMax={3} onChange={e => setDescription(e.target.value) } fullWidth /><br />
          </div>
          <div className="textfield">
            <TextField label="Numéro et libellé dans la voie de votre commerce" value={address ?? ''} onChange={e => setAddress(e.target.value)} fullWidth /><br />
          </div>
          <div className="textfield" style={{ width: '280px'}}>
            <TextField label="Code postal et ville" value={cityAndCode ?? ''} onChange={e => setCityAndCode(e.target.value)} fullWidth /><br />
          </div>
          <div className="textfield" style={{ width: '280px'}}>
            <TextField label="Numéro de téléphone" value={phoneNumber ?? ''} onChange={e => setPhoneNumber(e.target.value)} fullWidth /><br />
          </div>
          <div className="textfield" style={{ width: '420px'}}>
            <TextField label="Addresse email" value={emailAddress ?? ''} onChange={e => setEmailAddress(e.target.value)} fullWidth /><br />
          </div>
        </div>
      </div>
      <div className="main-button-container">
        <div className="main-button-margin">
          <button className="main-button-in-left" onClick={redirectToPrev}>Étape précédente</button>&nbsp;&nbsp;
        </div>
        <div className="main-button-margin">
          <button className="main-button-in-right" disabled={!canAdvance} onClick={() => updatePresentationData(
                brifyObject({
                  name: name!,
                  description: description!,
                  address: address!,
                  cityAndCode: cityAndCode!,
                  phoneNumber: phoneNumber!,
                  emailAddress: emailAddress!,
                }),
                redirectToNext,
              )
            }>
              Étape suivante
          </button>
        </div>
      </div>
      <div style={{ flex: 1 }} />
    </div>
  </>;
}
