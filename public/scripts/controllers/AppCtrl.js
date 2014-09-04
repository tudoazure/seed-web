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
						 	var msg = '{"PRDCNTXT":{"id":"187474","name":"Smartaccy","description":"The Vanca Western Wear Raglan Sleeveless Shirt Poly Georgette Fabric Nylon Lace Yoke Party Wear Casual Shirt Blue (Size-M)","image_url":"http://assets.paytm.com/images/catalog/product/C/CM/CMPLXWSHIRT000TSF1886TVBLLL/0x1280/70/5.jpg","price":"Rs 559","product_url":"https://catalogapidev.paytm.com/v1/mobile/product/188620?resolution=720x128…dentifier=samsung-GT-I9300-353743053543797&client=androidapp&version=4.2.1","first_name":"Anshuman","last_name":"Gothwal","email":"anshuman.gothwal@gmail.com","user_id":"11065317","merchant_id":"20237"}}';
						 	
						 	$scope.sendInitialMessage(productId, msg);
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

				$scope.sendInitialMessage = function(productId, msgText){

		              var timeInMilliSecond = UtilService.getTimeInLongString();
		              var strTimeMii = timeInMilliSecond.toString();
		              var messageId = $scope.chatServer.tegoId  + "-c-" + strTimeMii;
		              var mid = messageId.toString();

		              var message = {
		                can_forward: "true",
		                delete_after: "-1",
		                deleted_on_sender: "false",
		                flags: 0,
		                id: "",
		                last_ts: strTimeMii.substring(0, 10),
		                mid: mid,
		                receiver: $scope.products[productId].agent ,
		                sender: $scope.chatServer.tegoId,
		                sent_on: strTimeMii.substring(0, 10),
		                state: 0,
		                txt: msgText,
		                isProductDetails : true,
		                isPromoCode : false
		              }
		              $scope.products[productId].messages.push(message);
		              $scope.$storage.products = $scope.products;
		              var jId = $scope.products[productId].agent + "@" + Globals.AppConfig.ChatHostURI;
		              $scope.sendMessage(message, jId, timeInMilliSecond, mid);
		        };

		        $scope.sendMessage = function(body, jid, timeInMilliSecond, mid){
					if(body !== ""){
			            var message = $msg({to: jid, "type": "chat", "id": mid}).c('body').t(body).up().c('active', {xmlns: "http://jabber.org/protocol/chatstates"}).up()
			            .c('meta').c('acl', {deleteafter: "-1", canforward: "1", candownload: "1"});
		             	var to = Strophe.getDomainFromJid($scope.chatSDK.connection.jid);
             			var ping = $iq({to: to,type: "get",id: "ping1"}).c("ping", {xmlns: "urn:xmpp:ping"});
             			$scope.chatSDK.connection.send(ping);
      //        			UtilService.updateMessageStatus(mid, -1, Strophe.getNodeFromJid(jid), timeInMilliSecond);
      //        			var jid_id = $scope.chatSDK.jid_to_id(jid);
      //        			var tigo_id = Strophe.getNodeFromJid(jid);
						// $scope.chatSDK.send_Read_Notification(jid, jid_id, tigo_id);
			        }
				};

				$scope.init();
			}
    	]);
})(angular);