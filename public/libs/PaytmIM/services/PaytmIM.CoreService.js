(function (angular){
"use strict;"
angular.module('PaytmIM').factory('PaytmIM.CoreService', [ '$rootScope', 'PaytmIM.UtilService', '$localStorage',
    function ( $rootScope, UtilService, $localStorage ) {

    var readACKO = [];

    var on_Message_Update_Chat = function(response){
      var full_jid = response['full_jid'];
      var composing = response['composing'];
      var body = response['body'];
      var messageId = response['id'];
      var threadId = response['threadId'];
      var isProductDetails = false;
      if(response['id']){
        isSpecialMessage = response['isSpecialMessage'];
      }
      var jid = Strophe.getBareJidFromJid(full_jid);
      var jid_id = UtilService.getJidToId(jid);
      var MessID='mid-'+messageId;
       if (body) {
        var timeInMilliSeconds = messageId.substr(messageId.lastIndexOf('-') + 1, messageId.length);
        var strTimeMii = timeInMilliSeconds.toString().substring(0, 10);
        UtilService.addMessage($localStorage.chatServer.plustxtId, jid, body, strTimeMii, messageId, isSpecialMessage, threadId);
        //UtilService.updateMessageStatus(messageId, 2, Strophe.getNodeFromJid(jid), UtilService.getTimeInLongString());
      }  
    };
	
    var getChatSDK = function(connection){

        var chatSDK = {
            connection: connection,
            jid_to_id: function(jid) {
                return Strophe.getBareJidFromJid(jid).replace("@", "-").replace(/\./g, "-");
            },
            
            on_message: function(message) {
                //console.log("CoreService @on_message called :");
                var messageObj = xml2json.parser(message.outerHTML).message;
                var threadId = messageObj.thread;
                var body = messageObj.html;
                if (!body){
                    body = messageObj.body;
                    if (body) {
                        body = body.trim();
                    } else {
                        body = null;
                    }
                } 
                else {
                    body = body.contents();
                    var span = $("<span></span>");
                    body.each(function() {
                        if (document.importNode) {
                            $(document.importNode(this, true)).appendTo(span);
                        } 
                        else {
                            span.append(this.xml);
                        }
                    });
                    body = span;
                }
                //console.log("CoreService  @on_message - Message Text :", body);
                var response = {};
                response['full_jid'] = messageObj.from;
                response['id'] = messageObj.id;
                response['threadId'] = threadId;
                var jid = messageObj.from;
                var messageID = messageObj.id;
                //response['composing'] = $(message).find('composing');
                if(body){
                    response['body'] = body.trim();
                }
                try{
                    var productDetail = JSON.parse(body);
                    response['isSpecialMessage'] = true;
                }
                catch(e){
                    response['isSpecialMessage'] = false;
                }

                var DeliveryMessgae = messageID.search("-dv-");
                var readMessageAcknow = messageID.search("-r-");
                // Message stanze is an acknowledment 
                var timeInMilliSecond = UtilService.getTimeInLongString()
                if (DeliveryMessgae != -1) {
                    // code for update/ inform the user regarding delivered or read information
                    var delivered = messageObj.delivered; //$(message).find("delivered");
                    try {
                        var deliveryAckID = messageObj.delivered;
                    } 
                    catch (err) {
                    
                    }

                    var read = messageObj.read;//$(message).find("read");
                    try {
                        var readAckID = messageObj.read;
                    } 
                    catch (err) {
                    
                    }
                    // Delivery Acknowledgment
                    if (deliveryAckID){
                        //console.log("@on_message : Status -- DELIVERED From : " + response['full_jid']);
                        UtilService.updateMessageStatus(deliveryAckID, 2, Strophe.getNodeFromJid(jid), timeInMilliSecond);
                    }
                    //read  Acknowledgment
                    if (readAckID){
                        //console.log("@on_message : Status -- READ From : " + response['full_jid']);
                        UtilService.updateMessageStatus(readAckID, 3, Strophe.getNodeFromJid(jid), timeInMilliSecond);
                    }
                }
                else if(readMessageAcknow != -1){
                    var read = messageObj.read;
                    try {
                        var readAckID = messageObj.read;
                    } 
                    catch (err) {
                    }
                    if (readAckID){
                        //console.log("@on_message : Status -- READ From : " + response['full_jid']);
                        UtilService.updateMessageStatus(readAckID, 3, Strophe.getNodeFromJid(jid), timeInMilliSecond);
                    }
                }
                else {
                    //console.log("@on_message :New Text Message : " + message.textContent);

                    var strTimeMii = timeInMilliSecond.toString();
                    var messageId = $localStorage.chatServer.tegoId + "-dv-" + strTimeMii;
                    var mid = messageId.toString();
                    // Sending delivery acknowledment back.
                    var message2 = $msg({to: response['full_jid'], "type": "chat", "id": mid}).c('delivered').t(messageID).up().c('thread').t(threadId).up().c('meta');
                    // $('#mid-'+messageID).html('Delivered&nbsp;');
                    on_Message_Update_Chat(response);
                    connection.send(message2);
                    //console.log('@on_message : Delivery Acknowledment Sent ' + message2);
                }
                return true;
            },

            ping_handler : function (iq){
                //console.log('ping_handler Called');
                var offmessageArray= UtilService.getAllPendingMessages();       
                var jid;
                var mid;
                var body;
                var timeInMilliSecond;
                var strTimeMii;
                var message;
                if(offmessageArray == null || offmessageArray === undefined ){
                    //console.log("All Pending Messages Count:" + "0");
                }
                else{
                    console.log("All Pending Messages Count : " + offmessageArray.length);
                    for (var i=0 ; i < offmessageArray.length ; i++){
                        //console.log('tegoid ' + offmessageArray[i]['tegoid']+ ' mid '+offmessageArray[i]['mid']+ 'body '+ offmessageArray[i]['body'])
                        jid=offmessageArray[i]['tegoid']+'@' + Globals.AppConfig.ChatHostURI;
                        mid=offmessageArray[i]['mid'];
                        body=offmessageArray[i]['body'];
                        var thread = offmessageArray[i]['threadId'];
                        //console.log("THREAD : " + thread);
                        message = $msg({to: jid, "type": "chat", "id": mid}).c('body').t(body).up().c('thread').t(thread).up().c('active', {xmlns: "http://jabber.org/protocol/chatstates"}).up()
                        .c('request', {xmlns: 'urn:xmpp:receipts'}).up().c('meta').c('acl', {deleteafter: "-1", canforward: "1", candownload: "1"});
                       connection.send(message);
                       timeInMilliSecond = UtilService.getTimeInLongString();
                       strTimeMii = timeInMilliSecond.toString();
                        //   utility.comn.consoleLogger(' local cache message status upadted from mid '+mid);
                       UtilService.updateMessageStatus(mid, 0, Strophe.getNodeFromJid(jid), strTimeMii);
                       // For sending the closed message
                       // For sending the closed message
                       var closeChatMesg = {CLSCHAT : "chat closed" };
                       if(body == JSON.stringify(closeChatMesg)){
                         $rootScope.$broadcast("CloseUserChat", thread);
                       }
                    }
                }
                return true;
            },

            send_Read_Notification : function(jid, jid_id, tigo_id){
                var to = Strophe.getDomainFromJid(connection.jid);
                var ping = $iq({to:to,type: "get",id: "readACK"}).c("ping", {xmlns: "urn:xmpp:ping"});
                connection.send(ping);
                var informationObj={};
                informationObj['tigoId']=tigo_id;
                informationObj['timeStamp']= UtilService.getTimeInLongString();
                informationObj['jid']=jid;
                informationObj['jid_id']=jid_id;
                readACKO.push(informationObj);
            },

            ping_handler_readACK : function (iq){
                if (readACKO.length > 0 ) {
                    var infoObjec = readACKO.shift();
                    var tigo_id = infoObjec['tigoId'];
                    var timeStamp = infoObjec['timeStamp'];
                    var jid = infoObjec['jid'];
                    var jid_id = infoObjec['jid_id'];
                    var timeInMilliSecond;
                    var strTimeMii;
                    var messageId;
                    var mid;
                    var midreadArray = UtilService.updateMessageStatusAsRead(tigo_id, timeStamp);
                    for (var i = 0; i < midreadArray.length; i++) {
                      timeInMilliSecond = UtilService.getTimeInLongString();
                      strTimeMii = timeInMilliSecond.toString();
                      messageId = $localStorage.chatServer.tegoId + "-r-" + strTimeMii;
                      mid = messageId.toString();
                      // Create read ack and send the corresoding jabber client/
                      // Note that since it is an delivery/ read ack , message ID containd -div- attributes
                      var message2 = $msg({to: jid, "type": "chat", "id": mid}).c('read').t(midreadArray[i]).up().c('meta');
                      connection.send(message2);
                      //console.log('Read Acknowledgement Sent: ' + message2);
                    }
                }
                return true;
            }
        };           
        return chatSDK;
    };


        CoreService = {
            chatSDK: getChatSDK
        }

	   return CoreService;
	}]);
})(angular);

