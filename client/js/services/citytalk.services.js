(function () {

    'use strict';

    angular.module('cityTalk')
        .service('locationService', locationService);


    /**
     * Location service
     */
    locationService.$inject = ['$http', '$q', 'geoApiUrl'];
    function locationService($http, $q, geoApiUrl) {
        const self = this;

        /**
         * Get client city based on navigator.geolocation and google geoApi
         *
         * @returns promise
         */
        self.getCity = () => {
            if (!navigator.geolocation) {
                return false;
            }
            let deffered = $q.defer();
            navigator.geolocation.getCurrentPosition(success, error);
            function success(position) {
                $http({
                    url: ( geoApiUrl + position.coords.latitude + '%2C' +
                    position.coords.longitude + '&language=en' )
                }).then((response) => {
                    // Find city name in unordered results array
                    let responseResults = response.data.results;
                    let city = 'world';
                    for (let i in responseResults) {
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