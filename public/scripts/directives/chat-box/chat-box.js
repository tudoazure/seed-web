(function (angular){
  'use strict';
  angular.module('PaytmIM')
    .directive('chatBox', ['$rootScope', '$timeout', 'UtilService', '$window',
        function($rootScope, $timeout, UtilService, $window) {
      return {
        restrict: 'EA',
        templateUrl: 'scripts/directives/chat-box/chat-box-template.html',
        scope: false,
        link: function(scope, element, attrs) {
            if(scope.chatData.messages[0]){
              try{
                scope.product = JSON.parse(scope.chatData.messages[0].txt);
                console.log(scope.product);
              }
              catch(exception){
                
              }
              
            }

            var topHeight = ($window.innerHeight -310) + "px";
            element.find(".chat").css('top', topHeight);
            // scope.$watch(function(){
            //      return $window.innerHeight;
            //   }, function(value) {
            //     alert(value);
            //      console.log('height', value);
            // });

            scope.minimize = function(){
              scope.collapse = !scope.collapse;
            };

            scope.closeChat = function(){
                var body = {CLSCHAT : "chat closed" };
                body = UtilService.stringifyEmitUnicode(body, true);
                scope.userMessage = body;
                scope.submitMessage(true);
                scope.chatData.status = 'closed';
                scope.isClosed = !scope.isClosed;
            };

            scope.submitMessage = function(isCloseMessage){
              if(scope.userMessage.trim() != ""){
                var timeInMilliSecond = UtilService.getTimeInLongString();
                var strTimeMii = timeInMilliSecond.toString();
                var messageId = scope.chatData.user + "-c-" + strTimeMii;
                var mid = messageId.toString();

                var message = {
                  id: "",
                  last_ts: strTimeMii.substring(0, 10),
                  mid: mid,
                  receiver: scope.chatData.agent,
                  sender: scope.chatData.user,
                  sent_on: strTimeMii.substring(0, 10),
                  state: -1,
                  txt: scope.userMessage.replace(/\r?\n/g, " "),
                  isProductDetails : false,
                  isPromoCode : false,
                  isCloseMessage : isCloseMessage
                }
                scope.chatData.messages.push(message);
                var jId = scope.chatData.agent + "@" + Globals.AppConfig.ChatHostURI;
                scope.sendMessage(message, jId, timeInMilliSecond, mid);
                scope.userMessage = "";
              }
            };
          }
        }
    }]);
})(angular);