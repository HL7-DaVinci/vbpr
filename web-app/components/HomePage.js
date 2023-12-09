import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import GridLoader from 'react-spinners/GridLoader';

import { useClient } from '../context/ClientContext';
import { mergePages } from '../lib/fhir-resources';

import MeasureReportList from './MeasureReportList';

const Container = styled.div`
  width: 100%;
  padding: 2em;
`;

const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 10em;
`;

// TODO: Redirect to launcher if missing state
const HomePage = () => {
  const client = useClient();
  const [reports, setReports] = useState();

  useEffect(() => {
    const getResources = async () => {
      try {
        if (client) {
          const profile = 'http://hl7.org/fhir/us/davinci-vbpr/StructureDefinition/vbp-performance-measurereport';
          const results = await client.request(
            `MeasureReport?_profile=${encodeURIComponent(profile)}`,
            {
              pageLimit: 0,
              resolveReferences: ['reporter'],
            },
          );
          const mergedResults = mergePages(results);
          setReports(mergedResults.entry || []);
        }
      } catch (err) {
        console.error(err);
      };
    }
    getResources();
  }, [client]);

  return (
    <Container>
      <h1>Value-based Performance Reporting Demo App</h1>
      <h2>Available Reports</h2>
      {
        reports
          ? <MeasureReportList reports={reports} />
          : <SpinnerContainer><GridLoader /></SpinnerContainer>
      }
    </Container>
  );
};

export default HomePage;
