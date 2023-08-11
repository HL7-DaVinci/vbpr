import React from 'react';

import styled from 'styled-components';

import { FhirResource, fhirVersions } from 'fhir-react';

import MeasureReport from './MeasureReport';

const ListItemContainer = styled.div`
  padding: 1em;
  border: 1px solid gray;
  margin-bottom: 1em;
`;

const MeasureReportListContainer = styled.div`
  margin-top: 1.5em;
`;

const MeasureReportList = ({ reports }) => (
  <MeasureReportListContainer>
    {
      reports.map(report => (
        <ListItemContainer key={report.id}>
          <MeasureReport report={report} />
          <FhirResource
            fhirResource={report}
            fhirVersion={fhirVersions.R4}
          />
        </ListItemContainer>
      ))
  }
  </MeasureReportListContainer>
);

export default MeasureReportList;
