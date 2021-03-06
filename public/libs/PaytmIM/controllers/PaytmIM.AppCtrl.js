(function (angular){
    "use strict;"
    angular.module('PaytmIM')
        .controller('PaytmIM.AppCtrl', ['$scope', '$rootScope', '$localStorage', '$timeout', 'PaytmIM.CoreService', 'PaytmIM.ChatServerService', 'PaytmIM.UtilService', '$window',
            function ($scope, $rootScope, $localStorage, $timeout, CoreService, ChatServerService, UtilService, $window) {
                $scope.initialize = function(){
                    $scope.presentBargain = 0;
                    $scope.$storage = $localStorage;
                    $scope.threads = $scope.$storage.threads ? $scope.$storage.threads : {};
                    $scope.chatServer = $scope.$storage.chatServer ? $scope.$storage.chatServer : {};
                    if($scope.$storage && $scope.$storage.chatServer && $scope.$storage.threads){
                        angular.forEach($scope.$storage.threads, function(value, index){
                            $scope.presentBargain++;
                        });
                    }
                    // if(!$scope.$storage.presentBargain){
                    //     $scope.clearLocalStorage();
                    // }
                };

                $scope.init = function(){
                    $scope.initialize();
                    if($scope.$storage.presentBargain){
                        $scope.chatServer = $scope.$storage.chatServer;
                        $scope.chatServer.tid = UtilService.guid();
                        localStorage.tid = $scope.chatServer.tid;
                        $scope.stropheAttach($scope.$storage.chatServer.jid, $scope.$storage.chatServer.sid, parseInt(localStorage.rid, 10), $scope.chatServer.tid);
                    }
                    else{
                        $scope.clearLocalStorage();
                    }
                };

                $scope.clearLocalStorage = function(){
                    $localStorage.$reset();
                    localStorage.clear();
                    $scope.$storage.presentBargain = 0;
                    $scope.threads = {};
                    $scope.chatServer = {};
                    $scope.$storage.chatServer = {};
                    $scope.connection = null;
                    $timeout(function (){
                        $scope.$storage = $localStorage;
                    });
                };

                $scope.$on('Clear-Local-Storage', function(){
                    $scope.clearLocalStorage();
                });

                $scope.$on('Active-chat-Changed', function($event, activeThread){
                    angular.forEach($scope.$storage.threads, function(thread, i){
                        thread['isActiveChat'] = false;
                    })
                    if($scope.$storage.threads && $scope.$storage.threads[activeThread]){
                        $scope.$storage.threads[activeThread].isActiveChat = true;
                    }
                })

                angular.element($window).bind('blur', function(event) {
                    angular.element($window).bind('focus', function() {
                        if($scope.$storage.chatServer && $scope.chatServer.tid != localStorage.tid ){
                            $scope.initialize();
                            $scope.chatSDK = null;
                            if($scope.presentBargain){
                                if($scope.connection){
                                    $scope.connection.reattach($scope.$storage.chatServer.sid);
                                    $scope.chatSDK = CoreService.chatSDK($scope.connection);
                                }
                                $scope.chatServer = $scope.$storage.chatServer;
                                if($scope.chatServer){
                                    $scope.chatServer.tid = UtilService.guid();
                                    localStorage.tid = $scope.chatServer.tid;
                                    $scope.stropheAttach($scope.$storage.chatServer.jid, $scope.$storage.chatServer.sid, parseInt(localStorage.rid, 10), $scope.chatServer.tid);
                                    $scope.$apply(function (){
                                        $scope.$storage = $localStorage;
                                    });
                                }
                            }
                            else if($scope.connection){
                                try{
                                    $scope.connection.options.sync = true; // Switch to using synchronous requests.
                                    $scope.connection.flush();
                                    $scope.connection.reset();
                                }
                                catch(e){

                                }
                            }
                        }

                        angular.element($window).unbind('focus');
                    });
                });

                $scope.loginToChatServer = function(bargainObj){
                    $scope.loadingBroadcast(true);
                    ChatServerService.login.query({
                        email : bargainObj.user.login,
                        access_token :bargainObj.user.accessToken,
                        device_type : "web",
                        device_id : navigator.userAgent,
                        utype : "Normal",
                        device_token : "TOKEN",
                        device_detail : "none+details"
                    }, function success(response){
                        if(response && !response.status && response.data){
                            $scope.chatServer = {};
                            $scope.threads = {};
                            $scope.chatServer.tegoId = response.data['tego_id'];
                            $scope.chatServer.sessionId = response.data['session_id'];
                            $scope.chatServer.plustxtId = response.data['tego_id'] + "@" + Globals.AppConfig.ChatHostURI;
                            $scope.chatServer.password = response.data['password'] + response.data['tego_id'].substring(0, 3);
                            $scope.chatServer.connected = false;
                            $scope.stropheConnection($scope.chatServer.plustxtId, $scope.chatServer.password, bargainObj);
                        }
                        else{
                        }
                    }, function failure(error){
                        // If required put error message for the user.
                    })
                };

                $scope.stropheConnection = function(login, password, bargainObj){
                    $scope.chatServer.tid = UtilService.guid();
                    localStorage.tid = $scope.chatServer.tid;
                    $scope.$storage.chatServer = $scope.chatServer;
                    var connection = new Strophe.Connection(Globals.AppConfig.StropheConnect);
                    connection.connect(login, password, $scope.chatServer.tid, function (status) {
                        $scope.conectionStateChange(connection, status, bargainObj);
                    })
                };

                $scope.stropheAttach = function(jid, sid, rid, tid){
                    $scope.$storage.chatServer = $scope.chatServer;
                    var connection = new Strophe.Connection(Globals.AppConfig.StropheConnect);
                    connection.attach(jid, sid, rid, tid, function (status) {
                        $scope.conectionStateChange(connection, status);
                    })
                };

                $scope.conectionStateChange = function(connection, status, bargainObj){
                    console.log("StropheStatus : ", status);
                    $scope.connection = connection;
                    switch(status){
                        case Strophe.Status.CONNECTING:
                            break;
                        case Strophe.Status.CONNECTED:
                            $scope.loadingBroadcast(false);
                            $scope.chatSDK = CoreService.chatSDK(connection);
                            $scope.connectedState(bargainObj);
                            break;
                        case Strophe.Status.DISCONNECTING:
                            $scope.loadingBroadcast(true);
                            break;
                        case Strophe.Status.DISCONNECTED:
                            $scope.clearLocalStorage();
                            $scope.loadingBroadcast(false);
                            //$scope.loginToChatServer();
                            break;
                        case Strophe.Status.AUTHENTICATING:
                            break;
                        case Strophe.Status.ERROR:
                            break;
                        case Strophe.Status.CONNFAIL:
                            $scope.connectionFailed();
                            //$scope.clearLocalStorage();
                            break;
                        case Strophe.Status.AUTHFAIL:
                            $scope.authorizationFailed();
                            break;
                        case Strophe.Status.ATTACHED:
                            $scope.chatSDK = CoreService.chatSDK(connection);
                            $scope.connectedState();
                            break;
                    }
                };

                $scope.connectionFailed = function(){
                    console.log("It seems you are logged in from somewhere else. Going to disconnect from here.")
                    $rootScope.$broadcast('PaytmIM.MultipleSessionCreated');
                }

                $scope.authorizationFailed = function(){
                    console.log("You don't have access to bargain.")
                    $rootScope.$broadcast('PaytmIM.AuthorizationFailed');
                }

                $scope.disconnectXMPPConnection = function() {
                    if($scope.connection){
                        try{
                            $scope.connection.options.sync = true; // Switch to using synchronous requests.
                            $scope.connection.flush();
                            //$scope.connection.reset();
                            $scope.connection.disconnect();
                        }
                        catch(e){

                        }
                    }
                };

                $scope.connectedState = function(bargainObj){
                    $scope.chatServer.connected = true;
                    $scope.chatServer['sid'] = $scope.connection._proto.sid;
                    $scope.chatServer['jid'] = $scope.connection.jid;

                    if(bargainObj){
                        $scope.getMerchantAgent(bargainObj);
                    }

                    $scope.$storage.chatServer = $scope.chatServer;
                    $scope.chatSDK.connection.addHandler($scope.chatSDK.ping_handler, null, "iq", null, "ping1");
                    $scope.chatSDK.connection.addHandler($scope.chatSDK.ping_handler_readACK, null, "iq", null, "readACK");
                    var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
                    $scope.chatSDK.connection.send($pres());
                    $scope.chatSDK.connection.addHandler($scope.chatSDK.on_message, null, "message", "chat");
                };

                $scope.getMerchantAgent = function(bargainObj){
                    ChatServerService.getAgent.query({
                        session_id : $scope.chatServer.sessionId,
                        merchant_id : 1
                    }, function success(response){
                        if(response && !response.status && response.data){
                            var agentId = Globals.AppConfig.AgentId;//response.data.agent;
                            var msg = UtilService.stringifyEmitUnicode($scope.parseProduct(bargainObj))//Globals.AppConfig.ProductMessage[productId];
                            $scope.sendInitialMessage(bargainObj.product.product_id, agentId, msg);
                            $scope.$storage.presentBargain++;
                            console.log("Bargain started for Product : ", bargainObj.product.product_id);
                            $rootScope.$broadcast('PaytmIM.BargainStarted', bargainObj.product.product_id);
                        }
                        else{
                            $rootScope.$broadcast('PaytmIM.NoMerchantAgent');
                            if(!$scope.$storage.presentBargain){
                                $scope.disconnectXMPPConnection();
                            }
                        }
                    }, function failure(error){
                        $rootScope.$broadcast('PaytmIM.NoMerchantAgent');
                    })
                };
                
                $scope.parseProduct = function(bargainObj){
                    var productObj = bargainObj.product;
                    var user = bargainObj.user;
                    var color = '', size = '';
                    if(productObj.long_rich_desc && productObj.long_rich_desc.length){
                        angular.forEach(productObj.long_rich_desc, function(value, index){
                            if(value.title && value.title.toLowerCase() == 'description' ){
                                if(value.attributes){
                                    color = value.attributes.hasOwnProperty('Color') ? value.attributes.Color : '';
                                    size = value.attributes.hasOwnProperty('Size') ? value.attributes.Size : '';
                                }
                            }
                        })
                    }
                    var product = {
                        description: productObj.bargain_name,
                        email: user.login,
                        first_name : '',
                        id : productObj.product_id ? productObj.product_id.toString(): '' ,
                        image_url : productObj.image_url ,
                        last_name : '',
                        merchant_id: productObj.merchant.merchant_id ?  productObj.merchant.merchant_id.toString() : '' ,
                        name : productObj.merchant.merchant_name,
                        price : productObj.offer_price ? productObj.offer_price.toString() : '',
                        actual_price : productObj.actual_price ? productObj.actual_price.toString() : '',
                        product_url : productObj.url,
                        user_id: user.user_id ? user.user_id.toString() : '',
                        size : size,
                        color: color
                    };
                    var productMsg = {
                        PRDCNTXT : product
                    };
                    return productMsg;

                };

                
                $scope.initiateBargain = function(bargainObj){
                    if(bargainObj && bargainObj.product && bargainObj.product.product_id){
                        var productId = bargainObj.product.product_id;
                        $scope.initialize();
                        if($scope.$storage.presentBargain < Globals.AppConfig.MaxThreads){
                            var productPresent = false;
                            angular.forEach($scope.threads, function(value, index){
                                if(value.productId == productId){
                                    productPresent = true;
                                }
                            })
                            if(productPresent){
                                $rootScope.$broadcast('PaytmIM.ProductAlreadyBargaining', bargainObj.product);
                            }
                            else{
                                if($scope.chatServer && $scope.chatServer.connected){
                                    $scope.getMerchantAgent(bargainObj);
                                }
                                else{
                                    $scope.loginToChatServer(bargainObj);
                                }
                            }
                        }
                        else{
                            $rootScope.$broadcast('PaytmIM.MaxBargainLimitReached', Globals.AppConfig.MaxThreads);
                        }
                    }
                    else{
                        console.log("PRODUCT NOT PASSED");
                    }
                };

                $scope.$on('initiateBargain', function(event, bargainObj){
                    $scope.initiateBargain(bargainObj);
                })

                $scope.sendInitialMessage = function(productId, agentId, msgText){
                    var threadId = $scope.chatServer.tegoId + "-" +  productId;

                    var timeInMilliSecond = UtilService.getTimeInLongString();
                    var strTimeMii = timeInMilliSecond.toString();
                    var messageId = $scope.chatServer.tegoId  + "-c-" + strTimeMii;
                    var mid = messageId.toString();
                    var message = {
                        id: "",
                        last_ts: strTimeMii.substring(0, 10),
                        mid: mid,
                        receiver: agentId ,
                        sender: $scope.chatServer.tegoId,
                        sent_on: strTimeMii.substring(0, 10),
                        state: -1,
                        txt: msgText,
                        isProductDetails : true,
                        isPromoCode : false,
                        isCloseMessage : false,
                    }
                    var thread = {};
                    thread.user = $scope.chatServer.tegoId;
                    thread.status = "open";
                    thread.messages = [message];
                    thread.productId = productId;
                    thread.agent = agentId;
                    thread.threadId = threadId;
                    if($scope.$storage && $scope.$storage.threads){
                        thread.order = Object.keys($scope.$storage.threads).length;
                    }
                    else{
                        thread.order = 0;
                    }
                    //console.log(Object.keys($scope.threads).length);
                    $scope.threads[threadId] = thread;
                    $scope.$storage.threads = $scope.threads;
                    var jId = $scope.threads[threadId].agent + "@" + Globals.AppConfig.ChatHostURI;
                    $scope.sendMessage(message, jId, timeInMilliSecond, mid, threadId);
                };

                $scope.sendMessage = function(body, jid, timeInMilliSecond, mid, threadId){
                    if(body !== ""){
                        var to = Strophe.getDomainFromJid($scope.chatSDK.connection.jid);
                        var ping = $iq({to: to,type: "get",id: "ping1"}).c("ping", {xmlns: "urn:xmpp:ping"});
                        $scope.chatSDK.connection.send(ping);
                        var jid_id = $scope.chatSDK.jid_to_id(jid);
                        var tigo_id = Strophe.getNodeFromJid(jid);
                        $scope.chatSDK.send_Read_Notification(jid, jid_id, tigo_id, threadId);
                    }
                };

                $scope.$on('CloseUserChat', function(event, threadId){
                    if($scope.$storage.threads[threadId] && $scope.$storage.threads[threadId].status != "closed"){
                        console.log("Bargain Ended for Product : ", $scope.getProductIdFromThread(threadId));
                        $scope.$storage.threads[threadId].status = "closed";
                        $rootScope.$broadcast('PaytmIM.BargainEnded', $scope.getProductIdFromThread(threadId));
                        $scope.$storage.presentBargain = $scope.$storage.presentBargain - 1;
                        console.log("ActiveBargains", $scope.$storage.presentBargain);
                        delete $scope.threads[threadId];
                        delete $scope.$storage.threads[threadId];
                        $scope.$apply(function (){
                            $scope.$storage = $localStorage;
                        });
                        if($scope.$storage.presentBargain){
                            // delete $scope.threads[threadId];
                            // delete $scope.$storage.threads[threadId];
                            // $scope.$apply(function (){
                            //     $scope.$storage = $localStorage;
                            // });
                        }
                        else{
                            $scope.disconnectXMPPConnection();
                            // delete $scope.threads[threadId];
                            // delete $scope.$storage.threads[threadId];
                            // $scope.clearLocalStorage();
                        }
                    }
                    else if($scope.$storage.threads[threadId]){
                        delete $scope.threads[threadId];
                        delete $scope.$storage.threads[threadId];
                        $timeout(function (){
                            $scope.$storage = $localStorage;
                        });
                        if(!$scope.$storage.presentBargain){
                            localStorage["ngStorage-threads"] = null;
                            $scope.disconnectXMPPConnection();
                        }
                    }
                });

                $scope.$on('AgentCloseChat', function(event, threadId){
                    if($scope.$storage.threads[threadId]){
                        console.log("Bargain Ended for Product : ", $scope.getProductIdFromThread(threadId));
                        $rootScope.$broadcast('PaytmIM.BargainEnded', $scope.getProductIdFromThread(threadId));
                        $scope.$storage.presentBargain = $scope.$storage.presentBargain - 1;
                        $scope.$storage.threads[threadId].status = "closed";
                        $scope.threads[threadId] = $scope.$storage.threads[threadId];
                        $scope.$apply(function (){
                            //$scope.$storage = $localStorage;
                        });
                        // if(!$scope.$storage.presentBargain){
                        //     $scope.disconnectXMPPConnection();
                        // }
                        console.log("ActiveBargains", $scope.$storage.presentBargain);
                    }
                })

                $scope.getProductIdFromThread = function(threadId){
                    return threadId.split('-')[1];
                }

                $scope.gotoProduct = function(product){
                    $rootScope.$broadcast('PaytmIM.NavigateToProduct', product);
                };
                
                $scope.applyPromo =function(promoObj,product){
                    $rootScope.$broadcast('PaytmIM.ApplyPromoCode', promoObj,product);
                };

                $scope.copyPromoCode = function(message) {
                    var text = JSON.parse(message).PRMCODE.promocode;
                    window.prompt("Copy to clipboard: Ctrl+C or Cmd+C, Enter", text);
                };

                $scope.loadingBroadcast =function(isLoading){
                    $rootScope.$broadcast('PaytmIM.ShowLoading', isLoading);
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