(function () {

    'use strict';

    angular.module('cityTalk')
        .controller('startController', startController)
        .controller('findChatController', findChatController)
        .controller('chatController', chatController);


    /**
     * Start screen controller
     */
    startController.$inject = ['$state'];
    function startController($state) {
        var self = this;
        self.userName = localStorage.userName || '';

        self.setUserName = function (name) {
            localStorage.userName = name.replace(/(<([^>]+)>)/ig,"");
            $state.go('find');
        };
    }


    /**
     * Find screen controller
     */
    findChatController.$inject = ['$state', '$http', 'locationService'];
    function findChatController($state, $http, locationService) {
        var self = this;
        self.locationDenied = false;
        self.userName = localStorage.userName || '';
        self.userLocation = 'world';
        self.userPreferredLocation = 'world';
        self.userLabel = '';

        //Check if username set and locate city
        self.init = function () {
            if (self.userName === '') {
                $state.go('start');
            }
            self.setCity();
        };

        self.setCity = function () {
            locationService.getCity()
                .then(function (result) {
                    self.userLocation = result;
                    self.locationError = '';
                })
                .catch(function (err) {
                    console.log(err);
                    self.locationError = 'Allow using location to find your city';
                    self.locationDenied = true;
                });
        };

        self.startChat = function () {
            console.log('start chat');
            console.log('userName', self.userName);
            console.log('location', self.userLocation);
            console.log('userPreferredLocation', self.userPreferredLocation);
            console.log('label', self.userLabel);

            var apiUrl = 'http://localhost:3000';
            $http.post(apiUrl + '/findchat', {
                    userName: self.userName,
                    userLocation: (self.userPreferredLocation==='world') ?
                        'world' : self.userLocation,
                    userLabel: (self.userLabel==='') ?
                        'label' : self.userLabel.trim()
            })
                .then(function (responseData) {
                    console.log(responseData.data);
                    $state.go('chat', {
                        data: {
                            room: responseData.data.room,
                            status: responseData.data.status,
                            userName: self.userName,
                            userLocation: self.userLocation
                        }
                    });
                });
        };

        self.init();
    }


    /**
     * Chat controller
     */
    chatController.$inject = ['$state', '$scope', '$rootScope'];
    function chatController($state, $scope, $rootScope) {
        var self = this;

        if (!$state.params.data) {
            $state.go('find');
        }

        self.userName = $state.params.data.userName;
        self.userLocation = $state.params.data.userLocation;
        self.room = $state.params.data.room;
        self.message = '';
        self.chatStarted = false;

        var socket = io();
        // Connect
        socket.on('connect', function () {
            // Connected, let's sign-up for to receive messages for this room
            socket.emit('join room', 'userRoom_' + self.room);
        });

        // Start chat(both partners connected)
        socket.on('start', function (msg) {
            // Non-angular event, call $apply
            $scope.$apply(function () {
                self.chatStarted = true;
            });
        });

        // Send message
        self.sendMessage = function () {
            console.log('sendmesage', self.message);

            var msgData = {
                user: self.userName,
                text: self.message
            };

            socket.emit('chat message', msgData);
            self.message = '';
        };

        // Receive message
        socket.on('chat message', function (msg) {
            console.log('message: ' + msg);
            $scope.$broadcast('citytalk:incoming-msg', msg);
        });
    }

})();