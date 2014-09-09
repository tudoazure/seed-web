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
    LoginEmail: "webbargain@paytm.com",
    AccessToken : "aceb388d-87f2-4781-9f3b-b36c8d1d4e79",
    AgentId : "fmpwrn",
    ProductMessage: {
      "187474" :  '{"PRDCNTXT":{"id":"187474","name":"Smartaccy","description":"The Vanca Western Wear Raglan Sleeveless Shirt Poly Georgette Fabric Nylon Lace Yoke Party Wear Casual Shirt Blue (Size-M)","image_url":"http://assets.paytm.com/images/catalog/product/C/CM/CMPLXWSHIRT000TSF1886TVBLLL/0x1280/70/5.jpg","price":"Rs 559","product_url":"https://catalogapidev.paytm.com/v1/mobile/product/188620?resolution=720x128…dentifier=samsung-353743053543797&client=androidapp&version=4.2.1","first_name":"","last_name":"","email":"webbargain@paytm.com","user_id":"11065430","merchant_id":"20237"}}',
      "198045" : '{"PRDCNTXT":{"id":"198045","name":"Merchant 1","description":"Miss Chase Big Is Beautiful Oversized Top (Size-S)","image_url":"http://assets.paytm.com/images/catalog/product/C/CM/CMPLXWTOPSSP_01_15_05MCGNLL/0x1280/70/0.jpg","price":"Rs 799","product_url":"https://catalogapidev.paytm.com/v1/mobile/product/199500?resolution=720x128…dentifier=web&client=androidapp&version=4.2.1","first_name":"","last_name":"","email":"webbargain@paytm.com","user_id":"11065430","merchant_id":""}}',
      "198034" : '{"PRDCNTXT":{"id":"198034","name":"Merchant 1","description":"Miss Chase Flare For Fashion (Size-S)","image_url":"http://assets.paytm.com/images/catalog/product/C/CM/CMPLXWTOPSSP_02_07_31MCCBLL/0x1280/70/0.jpg","price":"Rs 999","product_url":"https://catalogapidev.paytm.com/v1/mobile/product/199498?resolution=720x128…dentifier=samsung-353743053543797&client=androidapp&version=4.2.1","first_name":"","last_name":"","email":"webbargain@paytm.com","user_id":"11065430","merchant_id":""}}'
    }
  }        
})();
