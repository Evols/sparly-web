
import React, { useEffect, useState } from 'react';

import './AppContainer.css';
import './vivify.min.css';

import { requireAppState } from 'state/appState';
import { LoadingPlaceholder } from './LoadingPlaceholder';
import { SiteBuilder } from './SiteBuilder';
import { RouteComponentProps } from 'react-router-dom';
import { BuilderActivePage, WebsiteBuilderState } from 'state/websiteBuilderState';
import { PayPage } from 'components/pages/pay/PayPage';

export enum ApplicationActivePage {
  SiteBuilder = 'SiteBuilder',
}

interface IProps {
  activePage: ApplicationActivePage,
  routeProps: RouteComponentProps<any>,
};

function _AppContainer({ activePage, routeProps }: IProps) {

  const { isAuthLoading, canUseApp, isAuthenticated, activeMembership } = requireAppState();
  const { isLoaded: isWebBuilderLoaded } = WebsiteBuilderState.useContainer();

  if (!canUseApp || !isWebBuilderLoaded) {
    if (isAuthLoading) {
      return <LoadingPlaceholder text="Chargement de l'authentification..." />;
    }
    if (isAuthenticated) {
      if (activeMembership === null) {
        return <LoadingPlaceholder text="Vérification du compte..." />;
      }
      if (activeMembership === false) {
        return <PayPage />;
      }
      if (!isWebBuilderLoaded) {
        return <LoadingPlaceholder text="Chargement des données..." />;
      }
    }
    // Fallback
    return <LoadingPlaceholder text="Chargement..." />;
  }

  let child = <React.Fragment />;
  switch (activePage) {
    case ApplicationActivePage.SiteBuilder:

      let builderPage = null as null | BuilderActivePage;
      const stepIdx = routeProps.match.params.stepidx?.replace(/^\//, '');
      switch (stepIdx) {
        case '1':
          builderPage = BuilderActivePage.Intro;
          break;
        case '2':
          builderPage = BuilderActivePage.TypeSelector;
          break;
        case '3':
          builderPage = BuilderActivePage.Presentation;
          break;
        case '4':
          builderPage = BuilderActivePage.TemplateSelector;
          break;
        case '5':
          builderPage = BuilderActivePage.Form;
          break;
        case '6':
          builderPage = BuilderActivePage.Uploader;
          break;
      }

      child = <SiteBuilder builderPage={builderPage}/>;
      break;
  }
  return (
    <div className="dashboard-main-container">
      <main className="dashboard-main-view">
        { child }
      </main>
    </div>
  );
}

export function AppContainer(props: IProps) {
  return (
    <_AppContainer {...props} />
  );
}
