(function (angular){
	"use strict;"

	angular.module('PaytmIM').factory('ChatServerService', ['$resource', function ($resource) {

		var ChatServerService;
		var manageReqPacketTransform = function(Obj) {
		    var str = [];
		    for(var p in Obj){
		      if(typeof(Obj[p]) == "object"){
		          str.push(encodeURIComponent(p) + "=" + JSON.stringify(Obj[p]));
		      } else {
		          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(Obj[p]));
		      }
		    }
		    return str.join("&");
		};
		var chatServerLogin = $resource(Globals.AppConfig.ChatServerConnect, {}, {
		  query: {
		    method:'POST', 
		    isArray: false, 
		    params:{}, 
		    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
		    transformRequest: manageReqPacketTransform
		  }
		});

		var getAgent = $resource(Globals.AppConfig.GetMerchantAgentId, {}, {
		  query: {
		    method:'POST', 
		    isArray: false, 
		    params:{}, 
		    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
		    transformRequest: manageReqPacketTransform
		  }
		});

		var fetchUserHistory = $resource(Globals.AppConfig.GetUserHistory, {}, {
		  query: {
		    method:'POST', 
		    isArray: false, 
		    params:{}, 
		    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
		    transformRequest: manageReqPacketTransform
		  }
		});

		ChatServerService = {
      		login: chatServerLogin,
      		getAgent : getAgent,
      		fetchUserHistory: fetchUserHistory
      	}

		return ChatServerService;
	}]);
})(angular);