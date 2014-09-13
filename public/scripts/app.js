(function (angular){
"use strict;"
	var app = angular.module('PaytmApp', ['ngRoute', 'PaytmIM']);
	app.config(['$routeProvider', function($routeProvider){
		$routeProvider
			.otherwise({
				redirectTo: '/'
			});
	}])
})(angular);