import Cookies from 'cookies';

import { getProxy } from '../../../server/proxy';

// NextJS route config
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  const proxy = await getProxy();

  // Remove the api prefix from url
  req.url = req.url.replace(/^\/api\/fhir/, '');

  const cookies = new Cookies(req, res);
  const authorization = cookies.get('authorization');

  // Don't forward cookies to the downstream server
  req.headers.cookie = '';

  if (authorization) {
    req.headers.authorization = authorization;
  }

  return new Promise((resolve, reject) => {
    proxy.once('error', (reason) => {
      console.error('Proxy Error: ', reason);
      reject(reason);
    });

    console.log(`requesting ${req.url}`)

    proxy.web(req, res);

    resolve();
  });
};
