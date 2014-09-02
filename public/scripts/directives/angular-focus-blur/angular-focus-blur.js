(function (angular){
  'use strict';
    angular.module('PaytmIM').directive('ngFocus', ['$parse', function($parse) {
	    return function(scope, element, attr) {
	        var fn = $parse(attr['ngFocus']);
	        element.on('focus', function(event) {
	            scope.$apply(function() {
	                fn(scope, {$event:event});
	            });
	        });
	    };
	}]);

	angular.module('PaytmIM').directive('ngBlur', ['$parse', function($parse) {
	    return function(scope, element, attr) {
	        var fn = $parse(attr['ngBlur']);
	        element.on('blur', function(event) {
	            scope.$apply(function() {
	                fn(scope, {$event:event});
	            });
	        });
	    };
	}]);
})(angular);