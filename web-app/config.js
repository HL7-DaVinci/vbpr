const fetchEndpointUrl = async () => {
  const res = await fetch('/api/fhir');
  const data = await res.json();
  console.log(data);
  return data.endpoint;
}

const clientConfig = {
  serverUrl: 'http://localhost:8080/fhir',
  noAuth: true,
};

const getClientConfig = async () => {
  const config = {
    ...clientConfig,
    serverUrl: (await fetchEndpointUrl()) || clientConfig.serverUrl,
  }
  return config;
};

export { getClientConfig };
