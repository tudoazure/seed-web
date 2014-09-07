(function (angular){
  'use strict';
  angular.module('PaytmIM')
    .directive('chatBox', ['$rootScope', '$timeout', 
        function($rootScope, $timeout) {
      return {
        restrict: 'EA',
        templateUrl: 'scripts/directives/chat-box/chat-box-template.html',
        scope: false,
        link: function(scope, element, attrs) {
          
          }
        }
    }]);
})(angular);