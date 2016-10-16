(function () {

    'use strict';

    angular.module('cityTalk', ['ui.router'])
        .constant('geoApiUrl', 'https://maps.googleapis.com/maps/api/geocode/json?latlng=');

})();