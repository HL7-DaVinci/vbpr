const getServerSideProps = async (req) => {
  const reqUrl = req.headers["referer"];
  const url = new URL(reqUrl);

  // const rawHostname = process.env.HOSTNAME || url.hostname || 'localhost';
  const rawHostname = url.hostname || 'localhost';
  const hostname = rawHostname === '0.0.0.0' ? 'localhost' : rawHostname;
  const port = process.env.PORT || url.port || '3000';
  const protocol = process.env.PROTOCOL || url.protocol || 'http:';
  const basePath = '';

  // console.log('========= SERVER PROPS =========');
  // console.log('Host:', hostname);
  // console.log('Port:', port);
  // console.log('Protocol:', protocol); 
  // console.log('Base Path:', basePath);
  // console.log('================================');

  return { 
    hostname: hostname === '0.0.0.0' ? 'localhost' : hostname,
    port,
    protocol,
    basePath,
  };
}

const getAppEndpoint = async (req) => {
  const {
    hostname,
    port,
    protocol,
    basePath,
  } = await getServerSideProps(req);
  return `${protocol}//${hostname}:${port}${basePath}`;
};

const getFHIREndpoint = async (req) => {
  const appEndpoint = await getAppEndpoint(req);
  return `${appEndpoint}/api/fhir`;
};

export default async (req, res) => {
  const fhirEndpoint = await getFHIREndpoint(req);
  res.status(200).json({ serverUrl: fhirEndpoint })
};
