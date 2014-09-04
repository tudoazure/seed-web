(function (angular){
	"use strict;"
	angular.module('PaytmIM')
		.controller('AppCtrl', ['$scope', '$rootScope', '$localStorage', '$timeout', 'CoreService', 'ChatServerService', 'UtilService',
			function ($scope, $rootScope, $localStorage, $timeout, CoreService, ChatServerService, UtilService) {
				$scope.init = function(){
					$scope.chatSDK = CoreService.chatSDK;
					$scope.$storage = $localStorage;
					$scope.products = $scope.$storage.products ? $scope.$storage.products : {};
					$scope.chatServer = $scope.$storage.chatServer ? $scope.$storage.chatServer : {};
				};

				$scope.loginToChatServer = function(productId){
					ChatServerService.login.query({
						email : "anshuman.gothwal@gmail.com",
						access_token : "3bc529f1-987d-4d3a-87a5-8af261fc6141",
						device_type : "web",
						device_id : navigator.userAgent,
						utype : "Normal",
						device_token : "TOKEN",
						device_detail : "none+details"
					}, function success(response){
						if(response && !response.status && response.data){
							$scope.chatServer.tegoId = response.data['tego_id'];
							$scope.chatServer.sessionId = response.data['session_id'];
							$scope.chatServer.plustxtId = response.data['tego_id'] + "@" + Globals.AppConfig.ChatHostURI;
							$scope.chatServer.password = response.data['password'] + response.data['tego_id'].substring(0, 3);
							$scope.chatServer.connected = false;
							$scope.stropheConnection($scope.chatServer.plustxtId, $scope.chatServer.password, productId);
						}
						else{
						}
					}, function failure(error){

					})
				};

				$scope.stropheConnection = function(login, password, productId){
					var connection = new Strophe.Connection(Globals.AppConfig.StropheConnect);
					connection.connect(login, password, function (status) {
						$scope.conectionStateChange(connection, status, productId);
					})
				};

				$scope.conectionStateChange = function(connection, status, productId){
					console.log("StropheStatus : ", status);
					$scope.chatSDK.connection = connection;
					switch(status){
						case Strophe.Status.CONNECTING:
							break;
						case Strophe.Status.CONNECTED:
							$scope.connectedState(productId);
							break;
						case Strophe.Status.DISCONNECTING:
							break;
						case Strophe.Status.DISCONNECTED:
							break;
						case Strophe.Status.AUTHENTICATING:
							break;
						case Strophe.Status.ERROR:
							break;
						case Strophe.Status.CONNFAIL:
							break;
						case Strophe.Status.AUTHFAIL:
							break;
						case Strophe.Status.ATTACHED:
							break;
					}
				};

				$scope.connectedState = function(productId){
					$scope.chatServer.connected = true;
					$scope.$storage.chatServer = $scope.chatServer;
					if(productId){
						$scope.getMerchantAgent(productId);
					}
					$scope.chatSDK.connection.addHandler($scope.chatSDK.ping_handler, null, "iq", null, "ping1"); 
				    $scope.chatSDK.connection.addHandler($scope.chatSDK.ping_handler_readACK, null, "iq", null, "readACK");   
				    var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
				    $scope.chatSDK.connection.send($pres());
				    // $scope.chatSDK.connection.sendIQ(iq, $scope.chatSDK.on_roster); 
				    // $scope.chatSDK.write_to_log("IQ for fetching contact information is send : " + iq);
				    $scope.chatSDK.connection.addHandler($scope.chatSDK.on_message, null, "message", "chat");
				};

				$scope.getMerchantAgent = function(productId){
					ChatServerService.getAgent.query({
						session_id : $scope.chatServer.sessionId,
						merchant_id : 1
					}, function success(response){
						if(response && !response.status && response.data){
						 	$scope.products[productId].agent = response.data.agent;
						 	$scope.products[productId].status = "open";
						 	$scope.$storage.products = $scope.products;
						}
						
					}, function failure(error){
						alert('Failure');
					})
				};

				$scope.initiateBargain = function(productId){
					if(!$scope.products[productId]){
						var threadId = productId + "-" + UtilService.guid();
						$scope.products[productId] = {};
						$scope.products[productId].threadId = threadId;
						$scope.products[productId].messages = [];
						$scope.products[productId].agent = "";
						if($scope.chatServer && $scope.chatServer.connected){
							$scope.getMerchantAgent(productId);
						}
						else{
							$scope.loginToChatServer(productId);
						}
					}
					else{
						console.log("Product already exist for bargain");
					}
				};

				$scope.init();
			}
    	]);
})(angular);