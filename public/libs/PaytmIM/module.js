(function (angular){
"use strict;"
	var app = angular.module('PaytmIM', ['ngRoute', 'ngResource', 'ngStorage']);
	
	app.config(['$httpProvider', function($httpProvider){
	  $httpProvider.defaults.useXDomain = true;
	}]);

	app.config(['$resourceProvider', function($resourceProvider){
	  $resourceProvider.defaults.stripTrailingSlashes = false;
	}]);
})(angular);