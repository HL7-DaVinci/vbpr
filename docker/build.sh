docker build docker/Dockerfile.fhir-server -t vbpr-fhir-server fhir-server/
docker build --ulimit=nofile=131072:1048576 -f docker/Dockerfile.init -t vbpr-init fhir-server/
docker build -f docker/Dockerfile.web-app -t vbpr-fhir-server web-app/
