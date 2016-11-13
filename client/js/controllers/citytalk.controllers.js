(function () {

    'use strict';

    angular.module('cityTalk')
        .controller('startController', startController)
        .controller('findChatController', findChatController)
        .controller('chatController', chatController);


    /**
     * Start screen controller
     */
    startController.$inject = ['$state', '$localStorage'];
    function startController($state, $localStorage) {
        const self = this;
        self.userName = $localStorage.userName || '';

        self.setValidUserName = (name) => {
            let validName = name.replace(/(<([^>]+)>)/ig, "");
            self.userName = validName;
            $localStorage.userName = validName;
        };

        self.setNameAndChangeState = (name) => {
            self.setValidUserName(name);
            $state.go('find');
        }
    }


    /**
     * Find screen controller
     */
    findChatController.$inject = ['$state', '$http', '$localStorage', 'locationService', 'citytalkApiUrl'];
    function findChatController($state, $http, $localStorage, locationService, citytalkApiUrl) {
        const self = this;
        self.locationDenied = false;
        self.locationError = '';
        self.userName = $localStorage.userName || '';
        self.userLocation = 'world';
        self.userPreferredLocation = 'world';
        self.userLabel = '';

        //Check if username set and locate city
        self.init = () => {
            if (self.userName === '') {
                $state.go('start');
            } else {
                self.setCity();
            }
        };

        self.setCity = () => {
            locationService.getCity()
                .then((result) => {
                    self.userLocation = result;
                    self.locationError = '';
                })
                .catch((err) => {
                    console.log(err);
                    self.locationError = 'Allow using location to find your city';
                    self.locationDenied = true;
                });
        };

        self.startChat = () => {
            $http.post(citytalkApiUrl + 'findchat', {
                userName: self.userName,
                userLocation: (self.userPreferredLocation === 'world') ?
                    'world' : self.userLocation,
                userLabel: (self.userLabel === '') ?
                    'label' : self.userLabel.trim()
            })
                .then((responseData) => {
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
    chatController.$inject = ['$state', '$scope', '$rootScope', 'socketService'];
    function chatController($state, $scope, $rootScope, socketService) {
        const self = this;

        //init
        self.init = () => {
            if (!$state.params.data) {
                $state.go('find');
            } else {
                self.userName = $state.params.data.userName;
                self.userLocation = $state.params.data.userLocation;
                self.room = $state.params.data.room;
                self.message = '';
                self.chatStarted = false;

                socketService.init();
                // Connect
                socketService.on('connect', () => {
                    // Connected, let's sign-up for to receive messages for this room
                    socketService.emit('join room', 'userRoom_' + self.room);
                });
                // Start chat(both partners connected)
                socketService.on('start', (msg) => {
                    self.chatStarted = true;
                });
                // Receive message
                socketService.on('chat message', (msg) => {
                    $scope.$broadcast('citytalk:incoming-msg', msg);
                });
            }
        };
        self.init();

        // Send message
        self.sendMessage = () => {
            const msgData = {
                user: self.userName,
                text: self.message
            };
            socketService.emit('chat message', msgData);
            self.message = '';
        };
    }

})();