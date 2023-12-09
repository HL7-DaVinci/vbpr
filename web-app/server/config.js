const getFHIREndpoint = () => {
  const codespace = process.env.CODESPACE_NAME;
  const hostname = process.env.FHIR_HOSTNAME || 'localhost';
  const port = process.env.FHIR_PORT || '8080';
  const path = process.env.FHIR_PATH || 'fhir';
  const codespaceUrl = codespace ? `https://${codespace}-${port}.app.github.dev/fhir` : undefined;

  const fhirEndpoint = process.env.FHIR_ENDPOINT
    || codespaceUrl
    || `http://${hostname}:${port}/${path}`;

   return fhirEndpoint;
}

export const getServerConfig = async () => {
  const fhirEndpoint = getFHIREndpoint();
  return { fhirEndpoint };
}
  