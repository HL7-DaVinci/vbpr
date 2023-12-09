
import httpProxy from 'http-proxy';
import { getServerConfig } from './config';

export const getProxy = async () => {
  const config = await getServerConfig();
  console.log(`Creating proxy to: ${config.fhirEndpoint}`)
  const proxy = httpProxy.createProxyServer({
    target: config.fhirEndpoint,
    autoRewrite: false,
  });
  return proxy;
};
