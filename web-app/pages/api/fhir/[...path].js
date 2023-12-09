import { getProxy } from '../../../server/proxy';

import Cookies from 'cookies';

// NextJS route config
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  const proxy = await getProxy();

  return new Promise((resolve, reject) => {
    // Remove the api prefix from url
    req.url = req.url.replace(/^\/api\/fhir/, '');

    const cookies = new Cookies(req, res);
    const authorization = cookies.get('authorization');

    // Don't forward cookies to the downstream server
    req.headers.cookie = '';

    if (authorization) {
      req.headers.authorization = authorization;
    }

    proxy.once('error', reject);
    proxy.web(req, res);
  });
};
