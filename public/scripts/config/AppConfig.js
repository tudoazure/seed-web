var Globals = {
  AppConfig : {}
};
(function() {
  var chatHostBaseURI = "https://chat-staging.paytm.com";
  Globals.AppConfig = {
    MaxThreads  : 3,  
  	ChatHostURI : chatHostBaseURI.replace(/.*?:\/\//g, ""),
    ChatServerConnect :  chatHostBaseURI + "/accounts/connect/",
    StropheConnect : chatHostBaseURI  + "/http-bind/",
    CloseChatMessage : '{"CLSCHAT" : "chat closed"}'
  }        
})();
