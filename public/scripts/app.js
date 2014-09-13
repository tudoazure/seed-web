(function (angular){
"use strict;"
	var app = angular.module('PaytmApp', ['ngRoute', 'PaytmIM']);
	app.config(['$routeProvider', function($routeProvider){
		$routeProvider
			.when('/product1', {
                templateUrl: 'views/product1.html',
                controller: ''
            })
			.otherwise({
				redirectTo: '/'
			});
	}])
})(angular);