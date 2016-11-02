describe('Controllers', function(){
    beforeEach(function(){
        module(function ($provide) {
            $provide.service('$localStorageMock', function () {
                var service = this;
            });
            $provide.service('$stateMock', function () {
                var service = this;
                service.go = function(){};
            });
        });
        module('cityTalk');
    }); //load module

    /**
     * startController
     */
    describe('startController', function(){
        var $controller,
            startController;

        beforeEach(inject(function (_$controller_, $stateMock, $localStorageMock) {
            $controller = _$controller_;
            startController = $controller('startController', {
                $state: $stateMock,
                $localStorage: $localStorageMock
            });
        }));

        it('Should set valid username, setValidUserName', function(){
            startController.setValidUserName('<b>name:)<</b>');

            expect(startController.userName).toBe('name:)');
        });

        it('Should set name and change state, setNameAndChangeState', inject(function($stateMock){
            spyOn($stateMock, 'go');
            startController.setNameAndChangeState('name');

            expect(startController.userName).toBe('name');
            expect($stateMock.go).toHaveBeenCalledWith('find');
        }));
    });

    /**
     * findController
     */
    // describe('findController', function(){
    //     var $controller,
    //         findController;
    //
    //     beforeEach(inject(function (_$controller_, $stateMock) {
    //         $controller = _$controller_;
    //         findController = $controller('findController', {
    //             $state: $stateMock
    //         });
    //     }));
    //
    //     it('Should set valid username, setValidUserName', function(){
    //         startController.setValidUserName('<b>name:)<</b>');
    //
    //         expect(startController.userName).toBe('name:)');
    //     });
    //
    // });


});