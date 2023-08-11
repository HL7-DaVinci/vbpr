import React from 'react';
import { ClientProvider } from '../context/ClientContext';
import '../global.css';

import 'fhir-react/build/style.css';
import 'fhir-react/build/bootstrap-reboot.min.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <ClientProvider>
      <Component {...pageProps} />
    </ClientProvider>
  );
}
