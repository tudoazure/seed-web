var Globals = {
  AppConfig : {}
};
(function() {
  var chatHostBaseURI = "https://chat-staging.paytm.com";
  Globals.AppConfig = {
    MaxThreads  : 3,
    MerchantId  : 1,  
    ChatHostURI : chatHostBaseURI.replace(/.*?:\/\//g, ""),
    ChatServerConnect :  chatHostBaseURI + "/accounts/connect/",
    GetMerchantAgentId :  chatHostBaseURI + "/one97/get-agent/",
    StropheConnect : chatHostBaseURI  + "/http-bind/",

    // Following should be replaced in the implementation
    AgentId : "2kxq45",
    UserLogin : "webbargain@paytm.com",
    UserToken : "aceb388d-87f2-4781-9f3b-b36c8d1d4e79"
 }      
})();