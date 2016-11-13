describe('Controllers', function () {
    beforeEach(function () {
        module(function ($provide) {
            $provide.service('$localStorageMock', function () {
                var service = this;
            });
            $provide.service('$stateMock', function () {
                var service = this;
                service.go = function () {
                };
                service.params = {};
            });
            $provide.service('socketServiceMock', function () {
                var service = this;
                service.init = function () {
                };
                service.on = function () {
                };
                service.emit = function () {
                };
            });
        });
        module('cityTalk');
    }); //load module


    /**
     * startController
     */
    describe('startController', function () {
        var $controller,
            startController;

        beforeEach(inject(function (_$controller_, $stateMock, $localStorageMock) {
            $controller = _$controller_;
            startController = $controller('startController', {
                $state: $stateMock,
                $localStorage: $localStorageMock
            });
        }));

        it('Should set valid username, setValidUserName', function () {
            startController.setValidUserName('<b>name:)<</b>');

            expect(startController.userName).toBe('name:)');
        });

        it('Should set name and change state, setNameAndChangeState', inject(function ($stateMock) {
            spyOn($stateMock, 'go');
            spyOn(startController, 'setValidUserName');
            startController.setNameAndChangeState('name');

            expect(startController.setValidUserName).toHaveBeenCalledWith('name');
            expect($stateMock.go).toHaveBeenCalledWith('find');
        }));
    });


    /**
     * findController
     */
    describe('findChatController', function () {
        var $controller,
            findChatController,
            deffered,
            locationService,
            scope;

        beforeEach(inject(function (_$controller_, $stateMock, $q, _locationService_, $rootScope, $localStorageMock) {
            scope = $rootScope.$new();
            deffered = $q.defer();
            locationService = _locationService_;
            spyOn(locationService, 'getCity').and.returnValue(deffered.promise);

            $controller = _$controller_;
            findChatController = $controller('findChatController', {
                $state: $stateMock,
                $http: {},
                $localStorage: $localStorageMock,
                locationService: locationService,
                citytalkApiUrl: {},
                scope: scope
            });
        }));

        it('Should init findChatController, init:name_set', inject(function ($stateMock) {
            spyOn($stateMock, 'go');
            spyOn(findChatController, 'setCity');

            findChatController.userName = '';
            findChatController.init();
            expect($stateMock.go).toHaveBeenCalledWith('start');
            expect(findChatController.setCity).not.toHaveBeenCalled();
        }));

        it('Should init findChatController, init:no_name_set', inject(function ($stateMock) {
            spyOn($stateMock, 'go');
            spyOn(findChatController, 'setCity');

            findChatController.userName = 'name';
            findChatController.init();
            expect(findChatController.setCity).toHaveBeenCalled();
            expect($stateMock.go).not.toHaveBeenCalledWith('start');
        }));

        it('Should set user city on reject location, setCity:on reject', function () {
            findChatController.setCity();

            deffered.reject();
            scope.$digest();
            expect(findChatController.locationError).toBe('Allow using location to find your city');
            expect(findChatController.locationDenied).toBe(true);
        });

        it('Should set user city on resolve location, setCity:on resolve', function () {
            findChatController.setCity();

            deffered.resolve('city');
            scope.$digest();
            expect(findChatController.locationError).toBe('');
            expect(findChatController.userLocation).toBe('city');
        });
    });


    /**
     * Chat controller
     */
    describe('chatController', function () {
        var $controller,
            scope,
            chatController;

        beforeEach(inject(function (_$controller_, $stateMock, $rootScope, socketServiceMock) {
            $controller = _$controller_;
            scope = $rootScope.$new();
            chatController = $controller('chatController', {
                $state: $stateMock,
                $scope: scope,
                $rootScope: {},
                socketService: socketServiceMock
            });
        }));

        it('Should init chatController, init:withoutParams', inject(function ($stateMock, socketServiceMock) {
            spyOn($stateMock, 'go');
            spyOn(socketServiceMock, 'init');

            chatController.init();

            expect($stateMock.go).toHaveBeenCalledWith('find');
            expect(socketServiceMock.init).not.toHaveBeenCalled();
        }));

        it('Should init chatController, init:withParams', inject(function ($stateMock, socketServiceMock) {
            spyOn($stateMock, 'go');
            spyOn(socketServiceMock, 'init');
            spyOn(socketServiceMock, 'on');
            $stateMock.params = {
                data: {
                    userName: 'name',
                    userLocation: 'city',
                    room: 123
                }
            };
            chatController.init();
            expect($stateMock.go).not.toHaveBeenCalled();
            expect(chatController.userName).toBe('name');
            expect(chatController.userLocation).toBe('city');
            expect(chatController.room).toBe(123);
            expect(chatController.message).toBe('');
            expect(chatController.chatStarted).toBe(false);
            expect(socketServiceMock.init).toHaveBeenCalled();
            expect(socketServiceMock.on).toHaveBeenCalledWith('connect', jasmine.any(Function));
            expect(socketServiceMock.on).toHaveBeenCalledWith('start', jasmine.any(Function));
            expect(socketServiceMock.on).toHaveBeenCalledWith('chat message', jasmine.any(Function));
        }));

        it('Should send message, sendMessage', inject(function ($stateMock, socketServiceMock) {
            spyOn(socketServiceMock, 'emit');
            chatController.userName = 'name';
            chatController.message = 'text';
            var msgData = {
                user: chatController.userName,
                text: chatController.message
            };

            chatController.sendMessage();

            expect(socketServiceMock.emit).toHaveBeenCalledWith('chat message', msgData);
            expect(chatController.message).toBe('');
        }));

    })


});