
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom';
import { isMobile, isChrome, isEdge, isFirefox, isOpera } from 'react-device-detect';

import './App.css';
import { AppContainer, ApplicationActivePage } from './components/main/AppContainer';
import { Auth0Provider } from '@auth0/auth0-react';
import { AppState } from 'state/appState';
import { WebsiteBuilderState } from 'state/websiteBuilderState';


function App() {

  const allowedBrowser = (( isChrome || isEdge || isFirefox || isOpera) && !isMobile)

  if (allowedBrowser) {

    return (
      <Auth0Provider
        domain="clovercloud.eu.auth0.com"
        clientId="ETGlEdBK5QF5KaYgR1jTTtBamt9gqeWl"
        redirectUri={window.location.origin}
        useRefreshTokens={true}
        audience="cloverweb-backend"
      >
        <AppState.Provider initialState={{ }}>
          <WebsiteBuilderState.Provider initialState={{ }}>
            <div className="App">
              <Router>
                <Switch>
                  <Route exact path='/builder:stepidx(/[1-6]+)?' component={(props: RouteComponentProps<any>) => <AppContainer activePage={ApplicationActivePage.SiteBuilder} routeProps={props} />} />
                  <Redirect from='*' to='/builder' />
                </Switch>
              </Router>
            </div>
          </WebsiteBuilderState.Provider>
        </AppState.Provider>
      </Auth0Provider>
    );
  } else if (isMobile) {
    return (
      <div>
        <a href="https://sparly.io"><img className="logo-brand" src="https://cloverstatic.s3.eu-west-3.amazonaws.com/Sparly-violet.svg" alt="Logo Sparly"/></a>
        <h1 className="title-compatibility" >Oops !</h1>
        <h2 className="message-compatibility">Sparly n'est pas encore compatible avec les smartphones et tablettes.<br />Merci de vous connecter avec un ordinateur.</h2>
      </div>
    )
  } else {
    return (
      <div>
        <a href="https://sparly.io"><img className="logo-brand" src="https://cloverstatic.s3.eu-west-3.amazonaws.com/Sparly-violet.svg" alt="Logo Sparly"/></a>
        <h1 className="title-compatibility">Oops !</h1>
        <h2 className="message-compatibility">Pour une expérience optimale, Sparly est uniquement disponible avec les navigateurs internet Chrome, Firefox, Edge et Opera.</h2>
      </div>
    )
  }

}

export default App;
