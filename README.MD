#Data fetcher app
For testing purposes
###Features
Can fetch data from various clients
- REST ResReq client
- HTML(SPA) afflu client

Can persist incoming data in the db

The app has super simple REST API just for having some handling stuff.
Routes:
- GET /data-fetcher/users [returns json {status:true|false}]
- GET /data-fetcher/dates [returns json {status:true|false}]

### Techs
- Typescript, Nodejs, Postgres

### TODO
- Setup via docker-compose
- in the container use pm2
- Write services tests
- add swagger description

### How to launch at the moment
- git clone or download repo
- move to /app folder
- make a copy of env.example and fill the vars
- npm install && npm run prod
- the app will listen 3000 port by default so use rest api