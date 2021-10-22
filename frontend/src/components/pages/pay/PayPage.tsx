
import React, { useState } from 'react';
import './PayPage.css';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import LogoutButton from 'components/common/LogoutButton';

const stripePromise = loadStripe('pk_live_51HpFEvAz01APa6QGmn8GZ55mL9HUlJ74VNSrGhce0SCUdIkauKAHr36wKf3mE4JUabLHbm1qzF6Om8hx4Z9vOJeT00RNysZj6y');

interface IProps {
};


export function PayPage({ }: IProps) {

  const [agreement, setAgreement] = useState(false);

  const [errorMessage, setErrorMessage] =useState({ color: 'black'});


  function handleChange(event: any) {
    if (!agreement) {
      setAgreement(true);
    }
    else {
      setAgreement(false);
    }
  }

  async function handleClick(event: any) {
    const stripe = await stripePromise;

    const res = await axios.post('/stripe/checkoutsession');
    const session = res.data;

    if (stripe !== null && agreement) {
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `result.error.message`.
      }
    } else {
      setErrorMessage({ color: 'red'});
    }
  };

  return <>
    <div className="banner-gradient">
      <a href="https://sparly.io"><img className="sparly-logo" src="https://cloverstatic.s3.eu-west-3.amazonaws.com/Sparly.svg" /></a>
    </div>
    <h2 className="payment-page-title">A quoi ressemblera mon site ?</h2>
    <p className="payment-page-text">Pour bien commencer, voici quelques exemples de sites qui ont été réalisés a l’aide de notre outil. Vous pouvez cliquer sur les aperçus afin de naviguer comme bon vous semble, et vous faire une idée du résultat final qui vous attend. Votre site se conformera à la structure des documents proposés.</p>
    <div className="website-screenshot-container">
      <div>
        <img className="website-screenshot" src="https://cloverstatic.s3.eu-west-3.amazonaws.com/rc1-screenshot.jpeg" draggable="false" />
      </div>
      <div>
        <img className="website-screenshot" src="https://cloverstatic.s3.eu-west-3.amazonaws.com/ri1-screenshot.jpg" draggable="false" />
      </div>
      <div>
        <img className="website-screenshot" src="https://cloverstatic.s3.eu-west-3.amazonaws.com/rs1-screenshot.jpg" draggable="false" />
      </div>
    </div>
    <h2 className="payment-page-title">Procédons au paiement.<br/> Nous y sommes presque.</h2>
    <p className="payment-page-text">Nous allons vous débiter d’un accompte de 50 euros TTC afin de produire une facture qui vous permettra de demander l’attribution de votre Chèque France Num. Cet accompte nous sert de garantie pour nos frais de service. D'ici 45 jours francs, vous sera demandé le versement par virement bancaire de la somme de 450 euros, portant la somme totale à 500 euros, condition nécessaire pour l'obtention de l'aide France Num. Vous avez ainsi tous les outils pour votre trésorerie, avec une facilité de paiement pensée pour vous aider.</p>
    <div className="checkbox-container">
      <input type="checkbox" id="scales" name="scales" onChange={handleChange}/>
      <label style={ errorMessage }className="checkbox-container-label">En cochant cette case, je reconnais avoir pris connaissance et accepter sans réserve les <a className="checkbox-container-a" href="https://www.sparly.io/cgu.html" target="_blank" rel="noopener">Conditions Générales d'Utilisation (CGU)</a>, <a className="checkbox-container-a" href="https://www.sparly.io/cgv.html" target="_blank" rel="noopener">Conditions Générales de Vente (CGV)</a>, ainsi que la <a className="checkbox-container-a" href="https://www.sparly.io/privacy.html" target="_blank" rel="noopener">Politique de confidentialité</a>.</label>
    </div>
    <button className="checkout-button" type="button" role="link" onClick={handleClick}>
      Payer
    </button>
    <br/>
    <LogoutButton></LogoutButton>
  </>;
}
