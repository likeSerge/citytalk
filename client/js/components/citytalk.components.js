(function () {

    'use strict';

    angular.module('cityTalk')
        .component('startForm', startFormComponent())
        .component('findForm', findFormComponent())
        .component('cityTalkHeader', cityTalkHeaderComponent())
        .component('chatForm', chatFormComponent());

    function cityTalkHeaderComponent() {
        return {
            templateUrl: 'views/components/header.html',
            bindings: {
                userName: '@',
                userLocation: '@'
            }
        }
    }

    function startFormComponent() {
        return {
            templateUrl: 'views/components/start-form.html',
            controller: startFormComponentController,
            bindings: {
                setUserName: '&',
                userName: '@'
            }
        }
    }

    function startFormComponentController() {
        var self = this;
        self.isNameValid = function (name) {
            return name.trim().length;
        }
    }

    function findFormComponent() {
        return {
            templateUrl: 'views/components/find-form.html',
            bindings: {
                startChat: '&',
                locationDenied: '<',
                label: '=',
                preferredLocation: '='
            }
        }
    }

    function chatFormComponent() {
        return {
            templateUrl: 'views/components/chat-form.html',
            controller: chatFormComponentController,
            bindings: {
                message: '=',
                chatStarted: '<',
                sendMessage: '&',
                userName: '@'
            }
        }
    }

    chatFormComponentController.$inject = ['$scope', '$element'];
    function chatFormComponentController($scope, $element) {
        var self = this;
        self.chatBox = $element.find('#chat-box');

        $scope.$on('citytalk:incoming-msg', function (event, data) {
            self.addIncomingMessage(data);
        });

        self.sendOutMessage = function () {
            if (self.message.length > 0) {
                self.addOutgoingMessage();
                self.sendMessage();
            }
        };

        self.addIncomingMessage = function (msg) {
            var date = new Date();
            date = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

            self.chatBox.append(
                '<p class="msg msg--in">' +
                '<span class="msg__user text-info">' + msg.user + '</span>' +
                '<span class="msg__text">' + msg.text + '</span>' +
                '<span class="msg__time text-info">' + date + '</span>' +
                '</p>'
            );
            console.log('---------------------------------');
            console.log(
                '<p class="msg msg--in">' +
                '<span class="msg__user text-info">' + msg.user + '</span>' +
                '<span class="msg__text">' + msg.text + '</span>' +
                '<span class="msg__time text-info">' + date + '</span>' +
                '</p>'
            );
            console.log('**************************************');
            self.chatBox[0].scrollTop = self.chatBox[0].scrollHeight;
        };

        self.addOutgoingMessage = function () {
            var date = new Date();
            date = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

            self.chatBox.append(
                '<p class="msg msg--out">' +
                '<span class="msg__user text-info">' + self.userName + '</span>' +
                '<span class="msg__text">' + self.message + '</span>' +
                '<span class="msg__time text-info">' + date + '</span>' +
                '</p>'
            );
            self.chatBox[0].scrollTop = self.chatBox[0].scrollHeight;
        };
    }

})();

