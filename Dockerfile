FROM hapiproject/hapi:latest

ENV hapi.fhir.implementationguides.vbpr.name=hl7.fhir.us.davinci-vbpr
ENV hapi.fhir.implementationguides.vbpr.version=1.0.0-ballot

ENV hapi.fhir.ig_runtime_upload_enabled=false
ENV hapi.fhir.install_transitive_ig_dependencies=true
ENV hapi.fhir.implementationguides.vbpr.reloadExisting=false
ENV hapi.fhir.implementationguides.vbpr.installMode=STORE_AND_INSTALL

EXPOSE 8080
