
let axiosDefaults = require('axios/lib/defaults');

export let authToken: string | undefined = undefined;
export function setAuthToken(v: string | undefined) {
  authToken = v;

  if (authToken) {
    axiosDefaults.headers.common['Authorization'] = authToken;
  } else {
    delete axiosDefaults.headers.common['Authorization'];
  }

}

export const host = window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : 'https://back.sparly.io';

axiosDefaults.baseURL = host;
// axiosDefaults.validateStatus = () => true;
