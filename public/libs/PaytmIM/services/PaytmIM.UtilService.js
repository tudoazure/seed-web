(function (angular){
	"use strict;"

	angular.module('PaytmIM').factory('PaytmIM.UtilService', ['$rootScope', '$localStorage', function ($rootScope, $localStorage) {
		var ua = navigator.userAgent.toLowerCase();
		var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		if (ua.indexOf(" chrome/") >= 0 || ua.indexOf(" firefox/") >= 0 || ua.indexOf(' gecko/') >= 0) {
		    var StringMaker = function() {
		        this.str = "";
		        this.length = 0;
		        this.append = function(s) {
		            this.str += s;
		            this.length += s.length;
		        }
		        this.prepend = function(s) {
		            this.str = s + this.str;
		            this.length += s.length;
		        }
		        this.toString = function() {
		            return this.str;
		        }
		    }
		} else {
		    var StringMaker = function() {
		        this.parts = [];
		        this.length = 0;
		        this.append = function(s) {
		            this.parts.push(s);
		            this.length += s.length;
		        }
		        this.prepend = function(s) {
		            this.parts.unshift(s);
		            this.length += s.length;
		        }
		        this.toString = function() {
		            return this.parts.join('');
		        }
		    }
		}

		decode64 = function(input) {
		    var output = new StringMaker();
		    var chr1, chr2, chr3;
		    var enc1, enc2, enc3, enc4;
		    var i = 0;
		    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
		    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		    while (i < input.length) {
		        enc1 = keyStr.indexOf(input.charAt(i++));
		        enc2 = keyStr.indexOf(input.charAt(i++));
		        enc3 = keyStr.indexOf(input.charAt(i++));
		        enc4 = keyStr.indexOf(input.charAt(i++));
		        chr1 = (enc1 << 2) | (enc2 >> 4);
		        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		        chr3 = ((enc3 & 3) << 6) | enc4;
		        output.append(String.fromCharCode(chr1));
		        if (enc3 != 64) {
		            output.append(String.fromCharCode(chr2));
		        }
		        if (enc4 != 64) {
		            output.append(String.fromCharCode(chr3));
		        }
		    }
		    return output.toString();
		};

		var guid = (function() {
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			}
			return function() {
				return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
			};
		})();

		var stringifyEmitUnicode = function(validObj, emitUnicode){
			var json = JSON.stringify(validObj);
             return emitUnicode ? json : json.replace(/[\u007f-\uffff]/g,
                function(c) { 
                  return '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4);
                }
             );
		};

		var getTimeInLongString = function(){
          return new Date().getTime();
        };

        parseTime = function(dateString){
			// var parseDate = new Date();
			// if(dateString){
			// 	var date = new Date (dateString);
			// 	var momentDate = moment(dateString);
			// 	parseDate = momentDate.format("h:mm a");
			// }
			var parseDate = new Date();
			if(dateString){
				var d1 = new Date (dateString * 1000);
				var hrs = d1.getHours();
				var minute = d1.getMinutes();
				var dd = "AM";
			    var h = hrs;
			    if (h >= 12) {
			        h = hrs-12;
			        dd = "PM";
			    }
			    if (h == 0) {
			        h = 12;
			    }
					parseDate = hrs +':'+ minute + ' '+dd;
				}
			return parseDate;
		};

		parseDate = function(dateString){
			// var parseDate = new Date();
			// if(dateString){
			// 	var date = new Date (dateString);
			// 	var momentDate = moment(dateString);
			// 	parseDate = momentDate.format("DD MMM YYYY");
			// }
			var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug','Sep', 'Oct','Nov', 'Dec'];
			var parseDate = new Date();
			if(dateString){
				var d1 = new Date (dateString * 1000);
				var date = d1.getDate();
				var month = month[d1.getMonth()];
				var year = d1.getFullYear();
				parseDate = date +' '+ month + ' '+year;
			}
			console.log('parseDate', parseDate)
			return parseDate;
		};

		var getLocalTime = function(ts) {
			var day = "Today";
			var month = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August','September', 'October','November', 'December'];
			var d1 = new Date(ts * 1000);
			var d2 = new Date();
			var d2_date = d2.getDate();

			var date = d1.getDate();
			if(date < d2_date){
				day = "Yesterday";
			}
			var month = month[d1.getMonth()];
			var hrs = d1.getHours();
			var minute = (d1.getMinutes() < 10 ? '0' :'') + d1.getMinutes() ;
			var dd = "AM";
		    var h = hrs;
		    if (h >= 12) {
		        h = hrs-12;
		        dd = "PM";
		    }
		    if (h == 0) {
		        h = 12;
		    }
			var dateString = day + ", " + date +' '+ month + ', '+h + ':' + minute + ' ' +dd; 
			return dateString;
			// return moment.unix(ts).format("Do MMM  h:mm A");
        };

        var milliTimeToString = function(inMilliSeconds) {
		    var date = new Date(inMilliSeconds);
		    var strTime = parseDate(date) + " "+ parseTime(date);
		    return strTime;
		};

        var jIdToId = function(jid) {
	        return Strophe.getBareJidFromJid(jid).replace("@", "-").replace(/\./g, "-");
    	};

    	var syncHistory = function(messageList){
        	var messageArray = []; var state = 0;
        	angular.forEach(messageList, function(value, index){
        		var messageObj ={};
	            messageObj['sender'] = value['sender'];
	            messageObj['receiver'] = value['receiver'];
	            messageObj['last_ts'] = value['last_ts'];
	            messageObj['sent_on'] = value['sent_on'];
	            try{
	                messageObj['txt'] = decode64(value['txt']);
	            }
	            catch(e){
	                
	            }
	            messageObj['id'] = value['id'];
	            messageObj['mid'] = value['mid'];
	            if (value['read_on'] != undefined)
	                state = 3;
	            else if (value['received_on'] != undefined)
	                state = 2;
	            else if (value['sent_on'] != undefined)
	                state = 1;
	            else
	                state = 0;
	            messageObj['state'] = state;//0-sending;1-sent;2-Delivered;3-read
	            if(value['sender'] && value['receiver']){
	                messageArray.push(messageObj);
	            }
        	})
			return messageArray;
	    };

    	var getAllPendingMessages = function(){
	        var messageArray = [];
	        var offlinemessage;
	        var midread = new Array();
	        angular.forEach($localStorage.threads, function(value, index){
		        var messageArray = value.messages;
	            for (var key1 in messageArray)
	            {
	                if (messageArray[key1]['state'] == -1) {      
	                    offlinemessage = {};
	                    offlinemessage['tegoid'] = messageArray[key1]['receiver'];
	                    offlinemessage['body'] = messageArray[key1]['txt']
	                    offlinemessage['mid'] = messageArray[key1]['mid'];
	                    offlinemessage['threadId'] = index;
	                    midread[midread.length] = offlinemessage;
	                }
	            }
	        })
	        return midread;
	    };

	    var updateMessageStatus = function(inmessageid, instatus, inotherpartytigoid, intime){
	        angular.forEach($localStorage.threads, function(value, index){
		        var messageArray = value.messages;
		        for (var key in messageArray) {
		            if (messageArray[key]['mid'] == inmessageid) {
		                messageArray[key]['state'] = instatus;
		                messageArray[key]['last_ts'] = intime;
		                value.messages = messageArray;
		            }
		        }

	        });
	        localStorage["ngStorage-threads"] = JSON.stringify($localStorage.threads);
	    };

	    var updateMessageStatusAsRead = function(inotherpartytigoid, intime, threadId){
			var messageArray = $localStorage.threads[threadId]['messages'];
			var midread = [];
			for (var key in messageArray)
			{
			    if (messageArray[key]['state'] == 0 && messageArray[key]['sender'] == inotherpartytigoid) {
			        messageArray[key]['state'] = 3;
			        messageArray[key]['last_ts'] = intime;
			        midread[midread.length] = messageArray[key]['mid'];
			    }
			}
			if(messageArray){
				localStorage["ngStorage-threads"] = JSON.stringify($localStorage.threads);
			}
			return midread;
		};

    	var addMessage = function(inRecieverJID, inSenderJID, inMessage, inTime, mid, isSpecialMessage, threadId) {
        	var otherpartyid;
	        var messagelist = [];
	        var receiverTigoId = inRecieverJID.substring(0, inRecieverJID.lastIndexOf('@'));
	        var senderTigoId = inSenderJID.substring(0, inSenderJID.lastIndexOf('@'));
	        var messageobj = {};
	        var specialMsg = '';
	        try{
	        	specialMsg = JSON.parse(inMessage);
	        	if(specialMsg.PRMCODE){
	        		messageobj['isPromoCode'] = true;
	        	}
	        	if(specialMsg.CLSCHAT){
	        		messageobj['isCloseMessage'] = true;
	        		$rootScope.$broadcast("AgentCloseChat", threadId);
	        	}

	        }
	        catch(exception){

	        }
	        messageobj['sender'] = senderTigoId;
	        messageobj['receiver'] = receiverTigoId;
	        messageobj['last_ts'] = inTime;
	        messageobj['sent_on'] = inTime;
	        messageobj['txt'] = inMessage;//messageobj['isPromoCode']  ?  compMsg : inMessage;
	        messageobj['id'] = "";
	        messageobj['mid'] = mid;
	        messageobj['state'] = 0;//0-sending;1-sent;2-Delivered;3-read
	        messageobj['isProductDetails'] = false;
	        if(threadId){
	        	messageobj['threadId'] = threadId;
	    	}

	        
	        if($localStorage.threads[threadId]){
	        	$localStorage.threads[threadId].messages.push(messageobj);
	        	$rootScope.$broadcast("ChatMessageChanged");
	        	localStorage["ngStorage-threads"] = JSON.stringify($localStorage.threads);
	        }
	        else{
	        	console.log("Thread not found");
	        }
	    };


		UtilService = {
			stringifyEmitUnicode : stringifyEmitUnicode,
			guid : guid,
      		getTimeInLongString: getTimeInLongString,
      		getMilliTimeToString : milliTimeToString,
      		getJidToId : jIdToId,
      		addMessage : addMessage,
      		syncHistory : syncHistory,
      		getAllPendingMessages : getAllPendingMessages,
      		updateMessageStatus : updateMessageStatus,
      		updateMessageStatusAsRead : updateMessageStatusAsRead,
      		getLocalTime : getLocalTime,
      	}

		return UtilService;
	}]);
})(angular);