(function (angular){
  'use strict';
  angular.module('PaytmIM')
    .directive('chatBox', ['$rootScope', '$timeout', 'UtilService',
        function($rootScope, $timeout, UtilService) {
      return {
        restrict: 'EA',
        templateUrl: 'scripts/directives/chat-box/chat-box-template.html',
        scope: false,
        link: function(scope, element, attrs) {
            scope.user = scope.user;
            scope.submitMessage = function(){
              if(scope.userMessage.trim() != ""){
                var timeInMilliSecond = UtilService.getTimeInLongString();
                var strTimeMii = timeInMilliSecond.toString();
                var messageId = scope.chatData.user + "-c-" + strTimeMii;
                var mid = messageId.toString();

                var message = {
                  can_forward: "true",
                  delete_after: "-1",
                  deleted_on_sender: "false",
                  flags: 0,
                  id: "",
                  last_ts: strTimeMii.substring(0, 10),
                  mid: mid,
                  receiver: scope.chatData.agent,
                  sender: scope.chatData.user,
                  sent_on: strTimeMii.substring(0, 10),
                  state: -1,
                  txt: scope.userMessage.replace(/\r?\n/g, " "),
                  isProductDetails : false
                }
                scope.chatData.messages.push(message);
                var jId = scope.chatData.agent + "@" + Globals.AppConfig.ChatHostURI;
                scope.sendMessage(message, jId, timeInMilliSecond, mid);
                scope.userMessage = "";
              }
            }
          }
        }
    }]);
})(angular);