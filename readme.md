# CityTalk

CityTalk is a chat application with random partner. User can find 
partner in his city or all over the world and also add label for 
future conversation(this can be used for finding users with same interest, 
when both type for example 'yoga'; or as password which you and your 
partner know beforehand).

See live demo: [CityTalk](https://citytalk.herokuapp.com/)

### Prerequisites

Modern version of nodejs and npm are required for local deployment.

### Local installation

App is configured for running on heroku. 
For local deployment go to 
```
./citytalk/client/js/client.conf.js
```
and toggle comments on lines:
```
// .constant('citytalkApiUrl', 'http://localhost:3000/')
   .constant('citytalkApiUrl', 'https://citytalk.herokuapp.com/')
```
to this:
```
   .constant('citytalkApiUrl', 'http://localhost:3000/')
// .constant('citytalkApiUrl', 'https://citytalk.herokuapp.com/')
```
Server config is OK for both local and prod.

Then from root folder run
```
npm run buildnstart
```
This will install node modules for server and client and build js, 
css and html, and run server. For more building and watching options 
see gulpfile:
```
./citytalk/client/gulpfile.js
```

##Built with
Angular, angular-ui-router, bootstrap, sass, npm, gulp;
nodejs, mongodb;
socket.io.

Heroku for deployment and mLab as mongodb hosting.