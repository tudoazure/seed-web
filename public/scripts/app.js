(function (angular){
"use strict;"
	var app = angular.module('PaytmApp', ['ngRoute', 'PaytmIM']);
	app.config(['$routeProvider', function($routeProvider){
		$routeProvider
			.when('/product1', {
				templateUrl:'views/product1.html',
				controller : ''
			})
			.when('/product2', {
				templateUrl:'views/product2.html',
				controller : ''
			})
			.when('/product3', {
				templateUrl:'views/product3.html',
				controller : ''
			})
			.otherwise({
				redirectTo: '/'
			});
	}])
})(angular);