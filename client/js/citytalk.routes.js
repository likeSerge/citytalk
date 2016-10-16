(function () {

    'use strict';

    angular.module('cityTalk')
        .config(RoutesConfig);

    RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function RoutesConfig($stateProvide, $urlRouterProvider) {
        $urlRouterProvider
            .otherwise('/start');

        $stateProvide
            // Start screen, where user enters his name
            .state('start', {
                url: '/start',
                templateUrl: 'views/start.html',
                controller: 'startController as start'
            })

            // Find screen, where location is determined and user adds label for chat
            .state('find', {
                url: '/find',
                templateUrl: 'views/find.html',
                controller: 'findChatController as find'
            })

            // Chat state
            .state('chat', {
                url: '/chat',
                templateUrl: 'views/chat.html',
                controller: 'chatController as chat',
                params: {
                    data: null
                }
            });
    }

})();