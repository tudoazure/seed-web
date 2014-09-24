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
    AgentId : "piayrq",
    UserLogin : "paytmuser7@mailinator.com",
    UserToken : "d7fa7907-e6c9-4b0c-a830-6fe2f86efa5d"
 }      
})();


// For Testing Purpose at staging
// Agents:
// 1) paytmagent1  : piayrq
// 2) paytmagent2  : 2kxq45
// 3) paytmagent3  : m0fwaq
// 4) paytmagent4  : qc94z6
// 5) paytmagent5  : fmpwrn


// Users:
// 1) login : "webbargain@paytm.com",
//   accessToken : "aceb388d-87f2-4781-9f3b-b36c8d1d4e79"
// 2) login : "paytmuser1@mailinator.com",
//   accessToken : "3de7a0ff-13e1-4421-b3a2-043f708a5e9e"
// 3) login : "paytmuser2@mailinator.com",
//   accessToken : "2f801d52-660e-4e13-8eb2-2c5421966807"
// 4) login : "paytmuser7@mailinator.com"
//   accessToken : "d7fa7907-e6c9-4b0c-a830-6fe2f86efa5d"