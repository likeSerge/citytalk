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
        const self = this;
        self.isNameValid = (name) => {
            return name.trim().length;
        };
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
        const self = this;
        self.chatBox = $element.find('#chat-box');

        $scope.$on('citytalk:incoming-msg', (event, data) => {
            self.addIncomingMessage(data);
        });

        self.sendOutMessage = () => {
            if (self.message.length > 0) {
                self.addOutgoingMessage();
                self.sendMessage();
            }
        };

        self.addIncomingMessage = (msg) => {
            let date = new Date();
            date = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

            self.chatBox.append(
                `<p class="msg msg--in">
                    <span class="msg__user text-info">${msg.user}</span>
                    <span class="msg__text">${msg.text}</span>
                    <span class="msg__time text-info">${date}</span>
                </p>`
            );
            self.chatBox[0].scrollTop = self.chatBox[0].scrollHeight;
        };

        self.addOutgoingMessage = () => {
            let date = new Date();
            date = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

            self.chatBox.append(
                `<p class="msg msg--out">
                    <span class="msg__user text-info">${self.userName}</span>
                    <span class="msg__text">${self.message}</span>
                    <span class="msg__time text-info">${date}</span>
                </p>`
            );
            self.chatBox[0].scrollTop = self.chatBox[0].scrollHeight;
        };
    }

})();

