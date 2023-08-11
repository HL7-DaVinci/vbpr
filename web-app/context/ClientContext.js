import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import PropTypes from 'prop-types';

import { oauth2 as SMART } from 'fhirclient';

import { getClientConfig } from '../config';

const ClientStateContext = createContext();
const ClientDispatchContext = createContext();

const ClientProvider = ({ children }) => {
  const [client, setClient] = useState();
  const [error, setError] = useState();
  const [clientConfig, setClientConfig] = useState();

  useEffect(() => {
    const fn = async () => {
      const result = await getClientConfig();
      setClientConfig(result);
      console.log(result)
    };
    fn();
  }, []);

  useEffect(() => {
    const fn = async () => {
      try {
        const result = await SMART.ready();
        setClient(result);
        setError();
      } catch (err) {
        setClient();
        setError(err);
        console.error('error:', err);
      }
    };
    fn();
  }, []);

  const authorize = useCallback(async () => {
    if (clientConfig) {
      const {
        clientId,
        clientSecret,
        redirectUri,
        clientScopes,
        serverUrl,
        noAuth,
      } = clientConfig;

      const scope = clientScopes
        ? clientScopes.join(' ')
        : 'openid offline';

      if (noAuth) {
        SMART.authorize({
          redirectUri: redirectUri || './app',
          fhirServiceUrl: serverUrl,
        });
        return;
      }

      SMART.authorize({
        clientId,
        clientSecret,
        scope,
        redirectUri: redirectUri || './app',
        iss: serverUrl,
      });
    }
  }, [clientConfig]);

  const value = useMemo(() => ({
    authorize,
    client,
    error,
  }), [authorize, client, error]);

  return (
    <ClientStateContext.Provider value={value}>
      {children}
    </ClientStateContext.Provider>
  );
};

ClientProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};

const useClientState = () => {
  const context = useContext(ClientStateContext);
  if (context === undefined) {
    throw new Error(
      'useClientState must be used within a ClientProvider',
    );
  }
  return context;
};

const useClientDispatch = () => {
  const context = useContext(ClientDispatchContext);
  if (context === undefined) {
    throw new Error(
      'useClientDispatch must be used within a ClientProvider',
    );
  }
  return context;
};

const useClient = () => {
  const { client } = useClientState();
  return client;
};

export {
  ClientProvider,
  useClientState,
  useClientDispatch,
  useClient,
};
