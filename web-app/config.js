const clientConfig = {
  serverUrl: 'http://localhost:8080/fhir',
  noAuth: true,
};

const getClientConfig = async () => clientConfig;

export { getClientConfig };
