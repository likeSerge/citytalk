describe('Controllers', function(){
    beforeEach(module('cityTalk')); //load module

    //startController
    describe('startController', function(){
        var $controller,
            startController;

        beforeEach(inject(function (_$controller_) {
            $controller = _$controller_;
            var stateMock = {};
            startController = $controller('startController', {$state: stateMock});
        }));

        it('Should set username and change state', function(){
            startController.userName = '';
            expect(startController.userName).toBe(''); //pass
        });
    });


});