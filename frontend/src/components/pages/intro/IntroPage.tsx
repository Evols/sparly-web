
import { PageStepper } from 'components/common/PageStepper';
import React from 'react';
import './IntroPage.css';
import { WebsiteBuilderState } from 'state/websiteBuilderState';

interface IProps {
};

export function IntroPage({ }: IProps) {
  const {
    redirectToNext,
  } = WebsiteBuilderState.useContainer();
  return <>
    <PageStepper />
    <div>
      <div style={{ flex: 1 }} />
       <div className="main-text-container">
        <h1 className="introduction-text-h1">Faisons conaissance ensemble</h1>
        <p className="main-text-container-p">Laissez-nous vous expliquer comment nous allons construire votre site.</p>
        <p className="main-text-container-p"><br />Soyons synthétiques, allons à l'essentiel et mettons nous dans la peau des utilisateurs. Qu'aimerions nous voir figurer sur le site internet ? Comment recceuillir toutes les informations utiles pour se projeter avec les produits de l'enseigne ?<br />
          <br />L'idée étant de jouer sur les mots clés afin de nous assurer une bonne position dans les résultats de recherche. Aucune inquiétude, nous allons vous guider dans chaque étape.<br />
        </p>
        <p className="main-text-container-p"><br />Merci de nous faire confiance pour votre site internet.</p>
        <div style={{ padding: '20px 0', justifyContent: 'space-between', display: 'flex', flexDirection: 'row' }}><div />
        <div>
          <button className="main-button-introduction" onClick={redirectToNext}>Etape suivante</button>
        </div>
       </div>
      <div style={{ flex: 1 }} />
     </div>
    </div>
  </>;
}
