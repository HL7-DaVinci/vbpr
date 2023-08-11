import React, { useEffect } from 'react';

import { useClientState } from '../context/ClientContext';
/**
 * Typically the launch page is an empty page with a `SMART.authorize`
 * call in it.
 */
const LauncherPage = () => {
  /**
   * This is configured to make a Standalone Launch, just in case it
   * is loaded directly. An EHR can still launch it by passing `iss`
   * and `launch` url parameters
   */
  const { authorize } = useClientState();

  useEffect(() => {
    authorize();
    // This will redirect, so don't do anything after...
  }, [authorize]);

  return 'Launching...';
};

export default LauncherPage;
