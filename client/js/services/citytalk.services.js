(function () {

    'use strict';

    angular.module('cityTalk')
        .service('locationService', locationService);


    /**
     * Location service
     */
    locationService.$inject = ['$http', '$q', 'geoApiUrl'];
    function locationService($http, $q, geoApiUrl) {
        var self = this;

        /**
         * Get client city based on navigator.geolocation and google geoApi
         *
         * @returns promise
         */
        self.getCity = function () {
            if (!navigator.geolocation) {
                return false;
            }
            var deffered = $q.defer();
            navigator.geolocation.getCurrentPosition(success, error);
            function success(position) {
                $http({
                    url: ( geoApiUrl + position.coords.latitude + '%2C' +
                    position.coords.longitude + '&language=en' )
                }).then(function (response) {
                    // Find city name in unordered results array
                    var responseResults = response.data.results;
                    var city = 'world';
                    for (var i in responseResults) {
                        if (responseResults[i].address_components[0].types[0] === 'locality') {
                            city = responseResults[i].address_components[0].long_name;
                            break;
                        }
                    }
                    deffered.resolve(city);
                });
            }

            function error(err) {
                deffered.reject(err);
            }

            return deffered.promise;
        }
    }


})();