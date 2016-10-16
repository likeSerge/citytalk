(function () {

    'use strict';

    angular.module('cityTalk')
        // .constant('citytalkApiUrl', 'http://localhost:3000/')
        .constant('citytalkApiUrl', 'https://citytalk.herokuapp.com/')
        .constant('geoApiUrl', 'https://maps.googleapis.com/maps/api/geocode/json?latlng=');

})();