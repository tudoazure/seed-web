(function (angular){
	"use strict;"
	angular.module('PaytmIM')
		.controller('AppCtrl', ['$scope', '$rootScope', '$localStorage', '$timeout', 'CoreService', 'ChatServerService', 'UtilService',
			function ($scope, $rootScope, $localStorage, $timeout, CoreService, ChatServerService, UtilService) {
				$scope.init = function(){
					
					$scope.$storage = $localStorage;
					if($scope.$storage && $scope.$storage.chatServer){
						$scope.chatServer = $scope.$storage.chatServer;
						$scope.chatServer.tid = UtilService.guid();
						$scope.attachConnection($scope.$storage.chatServer.jid, $scope.$storage.chatServer.sid, $scope.$storage.strophe.rid);
					}
					else{
						$localStorage.$reset();
					}
					$scope.threads = $scope.$storage.threads ? $scope.$storage.threads : {};
					$scope.chatServer = $scope.$storage.chatServer ? $scope.$storage.chatServer : {};
				};

				$scope.loginToChatServer = function(threadId){
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
							
							$scope.stropheConnection($scope.chatServer.plustxtId, $scope.chatServer.password, threadId);
						}
						else{
						}
					}, function failure(error){

					})
				};

				$scope.stropheConnection = function(login, password, threadId){
					$scope.chatServer.tid = UtilService.guid();
					localStorage.tid = $scope.chatServer.tid;
					$scope.$storage.chatServer = $scope.chatServer;
					var connection = new Strophe.Connection(Globals.AppConfig.StropheConnect);
					connection.connect(login, password, $scope.chatServer.tid, function (status) {
						$scope.conectionStateChange(connection, status, threadId);
					})
				};

				$scope.attachConnection = function(jid, sid, rid){
					$scope.chatServer.tid = UtilService.guid();
					localStorage.tid = $scope.chatServer.tid;
					$scope.$storage.chatServer = $scope.chatServer;
					var connection = new Strophe.Connection(Globals.AppConfig.StropheConnect);
					connection.attach(jid, sid, parseInt(rid, 10)+1, $scope.chatServer.tid, function (status) {
						$scope.conectionStateChange(connection, status);
					})
				};

				$scope.conectionStateChange = function(connection, status, threadId){
					console.log("StropheStatus : ", status);
					$scope.connection = connection;
					switch(status){
						case Strophe.Status.CONNECTING:
							break;
						case Strophe.Status.CONNECTED:
							$scope.chatSDK = CoreService.chatSDK(connection);
							$scope.connectedState(threadId);
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
							$localStorage.$reset();
							break;
						case Strophe.Status.AUTHFAIL:
							break;
						case Strophe.Status.ATTACHED:
							$scope.chatSDK = CoreService.chatSDK(connection);
							$scope.connectedState();
							break;
					}
				};

				$scope.connectedState = function(threadId){
					$scope.chatServer.connected = true;
					$scope.chatServer['sid'] = $scope.connection._proto.sid;
					$scope.chatServer['jid'] = $scope.connection.jid;
					if(threadId){
						$scope.getMerchantAgent(threadId);
					}
					$scope.$storage.chatServer = $scope.chatServer;
					$scope.chatSDK.connection.addHandler($scope.chatSDK.ping_handler, null, "iq", null, "ping1"); 
				    $scope.chatSDK.connection.addHandler($scope.chatSDK.ping_handler_readACK, null, "iq", null, "readACK");   
				    var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
				    $scope.chatSDK.connection.send($pres());
				    $scope.chatSDK.connection.addHandler($scope.chatSDK.on_message, null, "message", "chat");
				};

				$scope.getMerchantAgent = function(threadId){
					ChatServerService.getAgent.query({
						session_id : $scope.chatServer.sessionId,
						merchant_id : 1
					}, function success(response){
						if(response && !response.status && response.data){
						 	$scope.threads[threadId].agent = response.data.agent;
						 	$scope.threads[threadId].user = $scope.chatServer.tegoId;
						 	$scope.threads[threadId].status = "open";
						 	var msg = '{"PRDCNTXT":{"id":"187474","name":"Smartaccy","description":"The Vanca Western Wear Raglan Sleeveless Shirt Poly Georgette Fabric Nylon Lace Yoke Party Wear Casual Shirt Blue (Size-M)","image_url":"http://assets.paytm.com/images/catalog/product/C/CM/CMPLXWSHIRT000TSF1886TVBLLL/0x1280/70/5.jpg","price":"Rs 559","product_url":"https://catalogapidev.paytm.com/v1/mobile/product/188620?resolution=720x128…dentifier=samsung-GT-I9300-353743053543797&client=androidapp&version=4.2.1","first_name":"Anshuman","last_name":"Gothwal","email":"anshuman.gothwal@gmail.com","user_id":"11065317","merchant_id":"20237"}}';
						 	
						 	$scope.sendInitialMessage(threadId, msg);
						}
						else{
							console.log("No merchant available");
						}
						
					}, function failure(error){
						alert('Failure');
					})
				};

				$scope.initiateBargain = function(productId){
					var threadId = productId + "-" + UtilService.guid();
					if(!$scope.threads[threadId]){
						
						$scope.threads[threadId] = {};
						$scope.threads[threadId].productId = productId;
						$scope.threads[threadId].messages = [];
						$scope.threads[threadId].agent = "";
						if($scope.chatServer && $scope.chatServer.connected){
							$scope.getMerchantAgent(threadId);
						}
						else{
							$scope.loginToChatServer(threadId);
						}
					}
					else{
						console.log("Product already exist for bargain");
					}
				};

				$scope.sendInitialMessage = function(threadId, msgText){

		              var timeInMilliSecond = UtilService.getTimeInLongString();
		              var strTimeMii = timeInMilliSecond.toString();
		              var messageId = $scope.chatServer.tegoId  + "-c-" + strTimeMii;
		              var mid = messageId.toString();

		              var message = {
		                id: "",
		                last_ts: strTimeMii.substring(0, 10),
		                mid: mid,
		                receiver: $scope.threads[threadId].agent ,
		                sender: $scope.chatServer.tegoId,
		                sent_on: strTimeMii.substring(0, 10),
		                state: -1,
		                txt: msgText,
		                isProductDetails : true,
		                isPromoCode : false,
		                isCloseMessage : false
		              }
		              $scope.threads[threadId].messages.push(message);
		              $scope.$storage.threads = $scope.threads;
		              var jId = $scope.threads[threadId].agent + "@" + Globals.AppConfig.ChatHostURI;
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

				$scope.$on('ChatMessageChanged', function(event){
					$scope.$apply(function (){
                   		$scope.$storage = $localStorage;
                	});
				});

				$scope.init();
			}
    	]);
})(angular);