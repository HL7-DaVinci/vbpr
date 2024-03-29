const fetchClientConfig = async () => {
  const res = await fetch('/api/client-config', {
    next: {
      revalidate: 60,
    }}
  );
  const config = await res.json();
  return config;
}

const defaultClientConfig = {
  // fhirEndpoint: 'http://localhost:3000/api/fhir',
  noAuth: true,
};

export const getClientConfig = async () => {
  const clientConfig = await await fetchClientConfig();
  return {
    ...defaultClientConfig,
    ...clientConfig,
  }
};
