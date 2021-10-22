
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { setAuthToken } from 'core/backend';
import { useAsyncEffect } from 'core/utils';
import { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';

interface IInitialState {
}

function useAppState(initialState: IInitialState = {}) {

  const [shouldLoad, setShouldLoad] = useState(false);

  const {
    isLoading: isAuth0Loading,
    loginWithRedirect,
    getAccessTokenSilently,
  } = useAuth0();

  const [jwtLoaded, setJwtLoaded] = useState(false);

  useAsyncEffect(async () => {

    // If the Auth0 loading is finished
    if (shouldLoad && !isAuth0Loading) {

      // As Auth0's isAuthenticated is unrealiable af, we're gonna try to access the token directly. If it fails, it means we're not authenticated
      try {
        const newAuthToken = await getAccessTokenSilently({ audience: 'cloverweb-backend' });
        setAuthToken(newAuthToken);
        setJwtLoaded(true);
      } catch (e) {
        loginWithRedirect();
      }

    }

  }, [isAuth0Loading, shouldLoad]);

  const isAuthLoading = isAuth0Loading || !jwtLoaded;
  const isAuthenticated = jwtLoaded;

  const isLoading = isAuthLoading;

  const [activeMembership, setActiveMembership] = useState<null | boolean>(null);
  useAsyncEffect(async () => {
    if (isAuthenticated) {
      const res = await axios.get(`/membership`);
      setActiveMembership(res.data.isMember);
    }
  }, [isAuthenticated]);

  const canUseApp = isAuthenticated && (activeMembership ?? false);

  return {
    startLoading: function() {
      setShouldLoad(true);
    },

    isAuthLoading, isAuthenticated,
    isLoading, canUseApp,
    activeMembership,
  };
}

export const AppState = createContainer(useAppState);

export function requireAppState() {
  const { startLoading, ...appState } = AppState.useContainer();
  useEffect(function() {
    startLoading();
  }, []);
  return appState;
}
