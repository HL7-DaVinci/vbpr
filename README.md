# Getting Started

## Container Deployment

```
$ cd docker
$ docker-compose build
$ docker-compose up
```

### Open the web app
http://localhost:3000

## Local Development

### Start and bootstrap the FHIR server and web application

```./bin/bootstrap.sh```

(_This will take about 15 minutes or so..._)

### Open the web app
http://localhost:3000

### Other Operations

#### Stop the FHIR server (this will NOT delete the data in the FHIR store)
```./bin/stop-fhir-server.sh```

#### Start the FHIR server (afger the initial bootstrap)
```./bin/stop-fhir-server.sh```

#### Start the web app server
```cd web-app && npm run start```
