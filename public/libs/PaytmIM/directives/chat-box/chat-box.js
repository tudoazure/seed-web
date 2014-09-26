(function (angular){
  'use strict';
  angular.module('PaytmIM')
    .directive('chatBox', ['PaytmIM.UtilService', '$window', '$sce',
        function(UtilService, $window, $sce) {
      return {
        restrict: 'EA',
        templateUrl: 'libs/PaytmIM/directives/chat-box/chat-box-template.html',
        scope: false,
        link: function(scope, element, attrs) {
            scope.thread = scope.chatData.threadId;
            scope.getProduct = function(){
              if(scope.chatData.messages[0]){
                try{
                  scope.product = JSON.parse(scope.chatData.messages[0].txt);
                }
                catch(e){}
              }
            };

            scope.getProduct();
            
            scope.parseDate = function(ts){
              return UtilService.getLocalTime(ts);
            };

            scope.parseJSON= function(json){
              return JSON.parse(json);
            }

            scope.setFocus = function(){
              scope.$emit('Active-chat-Changed', scope.thread);
            };

            var w = angular.element($window);
            scope.getHeight = function() {
                return w[0].innerHeight;
            };
            scope.windowHeight = scope.getHeight();
            

            scope.setWindowTop = function(height){
               var topHeight = (height -315) + "px";
              var minTopHeight = (height -38) +"px";
              var chatDiv = element[0].getElementsByClassName('chat');
              var minChatDiv = element[0].getElementsByClassName('minChat');
              if(minChatDiv && minChatDiv.length){
                minChatDiv[0].style.top = minTopHeight;
              }
              if(chatDiv && chatDiv.length){
                chatDiv[0].style.top = topHeight;
              }
              // element.find(".chat").css('top', topHeight);
              // element.find(".minChat").css('top', minTopHeight);
            };

            scope.setWindowTop(scope.windowHeight);
            
            
            scope.$watch(scope.getHeight, function(newValue, oldValue) {
                scope.windowHeight = newValue;
                scope.setWindowTop(newValue);
            });

            w.bind('resize', function () {
                scope.$apply();
            });

            scope.minimize = function(){
              scope.collapse = !scope.collapse;
            };

            scope.returnTrustHtml = function(msg){
              return $sce.trustAsHtml(msg);
            };

            scope.closeChat = function(){
              if(scope.chatData.status != 'closed'){
                var body = {CLSCHAT : "chat closed" };
                body = UtilService.stringifyEmitUnicode(body, true);
                scope.userMessage = body;
                scope.submitMessage(true);
                // scope.chatData.status = 'closed';
                scope.isClosed = !scope.isClosed;
              }
              else{
                scope.isClosed = !scope.isClosed;
                scope.$emit('CloseUserChat', scope.thread);
              }
            };

            scope.getMesgState = function(state){
              var messageState = "Sent";
              switch(state){
                case 0:
                  messageState = "Received"
                  break;
                case 1:
                  messageState = "Sent"
                  break;
                case 2:
                  messageState = "Delievered"
                  break;
                case 3:
                  messageState = "Read"
                  break;
              }
              return messageState;
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
                scope.sendMessage(message, jId, timeInMilliSecond, mid, scope.thread);
                scope.userMessage = "";
              }
            };
          }
        }
    }]);
})(angular);