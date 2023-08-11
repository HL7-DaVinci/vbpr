import React from 'react';

import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

import fhirpath from 'fhirpath';

import { format } from 'date-fns'

import {
  getInstanceName,
  getInstanceDescription,
  getPerformanceMeasures,
  parseFhirPeriod,
  getPaidThroughDate,
} from '../../lib/fhir-resources';

const ReportListItemName = styled.h4`
  font-weight: bold;
  margin-bottom: 0.5em;
`;

const MeasureReportHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border: 1px solid gray;
  padding: 1em;
  margin-bottom: 1em;
`;

const MeasureReportContainer = styled.div`
  padding: 2em;
  border: 1px solid gray;
  margin-bottom: 1em;
`;

const PerformanceMeasureContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const ReportListItemDescription = styled(ReactMarkdown)`
`;

const getSubjectName = fhirpath.compile('subject.display');
const getReporterName = fhirpath.compile('reporter.name');
const getReportStatus = fhirpath.compile('status');

const Period = ({ period }) => {
  const parsedPeriod = parseFhirPeriod(period);
  return (
    <div>
      <span>{format(parsedPeriod.start, 'MM/dd/yyyy')}</span>
      {' to '}
      <span>{format(parsedPeriod.end, 'MM/dd/yyyy')}</span>
    </div>
  );
};

const MeasureReportHeader = ({ report }) => (
  <MeasureReportHeaderContainer>
    <div>
      <h4>Subject (Provider)</h4>
      <div>{getSubjectName(report)}</div>
    </div>
    <div>
      <h4>Reporter (Payer)</h4>
      <div>{getReporterName(report)}</div>
    </div>
    <div>
      <h4>Period</h4>
      <Period period={report.period} />
    </div>
    <div>
      <h4>Paid Through Date</h4>
      <div>{getPaidThroughDate(report) && format(getPaidThroughDate(report), 'MM/dd/yyyy')}</div>
    </div>
    <div>
      <h4>Status</h4>
      <div>{getReportStatus(report)}</div>
    </div>
  </MeasureReportHeaderContainer>
);

const PerformanceMeasures = ({ groups }) => !!(groups && groups.length) && (
  <>
    <h2>Performance Measures</h2>
    <div>
      {groups.map(group => (
        <PerformanceMeasureContainer key={group.id}>
          <div>
            {group.name}
          </div>
          <div>
            {group.value || 'N/A'}
          </div>
        </PerformanceMeasureContainer>
      ))}
    </div>
  </>
);

const MeasureReport = ({ report }) => (
  <MeasureReportContainer>
    <ReportListItemName>{getInstanceName(report)}</ReportListItemName>
    <ReportListItemDescription>{getInstanceDescription(report)[0]}</ReportListItemDescription>
    <MeasureReportHeader report={report} />
    <PerformanceMeasures groups={getPerformanceMeasures(report)} />
  </MeasureReportContainer>
);

export default MeasureReport;
