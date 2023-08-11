import fhirpath from 'fhirpath';
import { parse } from 'date-fns';

export const getInstanceName = fhirpath.compile("meta.extension.where(url = 'http://hl7.org/fhir/StructureDefinition/instance-name').valueString");
export const getInstanceDescription = fhirpath.compile("meta.extension.where(url = 'http://hl7.org/fhir/StructureDefinition/instance-description').valueMarkdown");

export const parseFhirDate = value => parse(value, 'yyyy-MM-dd', new Date());

export const mergePages = pages => {
  if (pages.resourceType) {
    return pages;
  }

  const entry = pages.reduce((acc, item) => [...acc, ...(item.entry || [])
    .map(({ resource }) => resource)], []);

  return { ...pages[0], entry };
};

const getGroupName = group => {
  if (group.code.text) {
    return group.code.text;
  }
  return fhirpath.evaluate(group, 'code.coding.code');
};

const getMeasureScoreValue = score => {
  if (!score) {
    return null;
  }

  if (score.value) {
    return score.value;
  }

  const extension = fhirpath.evaluate(score, "extension.where(url = 'http://hl7.org/fhir/us/davinci-vbpr/StructureDefinition/alternate-measurescore')")[0];
  if (extension) {
    if (extension.valueBoolean) {
      return extension.valueBoolean;
    }
    if (extension.valueDecimal) {
      return extension.valueDecimal;
    }
    if (extension.valueInteger) {
      return extension.valueInteger;
    }
    if (extension.valueCodeableConcept) {
      return extension.valueCodeableConcept.text;
    }
    if (extension.valueMoney) {
      return extension.valueMoney.value;
    }
  }
  return null;
};

const getPaymentStream = group => {
  const paymentStreamType = fhirpath.evaluate(group, "extension.where(url = 'http://hl7.org/fhir/us/davinci-vbpr/StructureDefinition/payment-stream').extension.where(url = 'type')");
  const paymentStreamIncentive = fhirpath.evaluate(group, "extension.where(url = 'http://hl7.org/fhir/us/davinci-vbpr/StructureDefinition/payment-stream').extension.where(url = 'incentive')");

  return {
    type: paymentStreamType.valueCodeableConcept ? paymentStreamType.valueCodeableConcept.text : null,
    incentive: paymentStreamIncentive.valueCodeableConcept ? paymentStreamIncentive.valueCodeableConcept : null,
  };
};

export const parseFhirPeriod = period => {
  if (period) {
    return {
      start: parseFhirDate(period.start),
      end: parseFhirDate(period.end),
    };
  }
  return null;
};

const getServicePeriod = group => {
  const period = fhirpath.evaluate(group, "extension.where(url = 'http://hl7.org/fhir/us/davinci-vbpr/StructureDefinition/service-period').single()");
  if (period && period.valuePeriod) {
    return parseFhirPeriod(period.valuePeriod);
  }
  return null;
};

export const getPaidThroughDate = group => {
  const date = fhirpath.evaluate(group, "extension.where(url = 'http://hl7.org/fhir/us/davinci-vbpr/StructureDefinition/paid-through-date').valueDate")[0];
  if (date) {
    return parseFhirDate(date);
  }
  return null;
};

const getStratifiers = resource => fhirpath.evaluate(resource, 'stratifier')
  .map(({ stratum, code }) => ({
    stratum: stratum.map(({ measureScore, value, component }) => ({
      measureScore: getMeasureScoreValue(measureScore),
      value,
      component,
    })),
    code,
  }));

export const getPerformanceMeasures = resource => fhirpath.evaluate(resource, 'group')
  .map(group => ({
    id: group.id,
    name: getGroupName(group),
    value: getMeasureScoreValue(group.measureScore),
    paymentStream: getPaymentStream(group),
    servicePeriod: getServicePeriod(group),
    paidThroughDate: getPaidThroughDate(group),
    stratifier: getStratifiers(group),
  }));
