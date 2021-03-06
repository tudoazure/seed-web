(function (angular){
	"use strict;"
	angular.module('PaytmApp')
		.controller('productPreviewCtrl', ['$scope', '$rootScope', '$location',
			function ($scope, $rootScope, $location) {
				var products = {
					187474	: {"product_id":187474,"product_type":"product","name":"The Vanca Western Wear Raglan Sleeveless Shirt Poly Georgette Fabric Nylon Lace Yoke Party Wear Casual Shirt Blue (Size-M)","bargain_name":"The Vanca Western Wear Raglan Sleeveless Shirt Poly Georgette Fabric Nylon Lace Yoke Party Wear Casual Shirt Blue (Size-M)","url":"https://catalogapidev.paytm.com/v1/mobile/product/187474","short_desc":"","long_rich_desc":[{"title":"Description","description":"Western Wear Raglan Sleeveless Shirt Poly Georgette Fabric Nylon Lace Yoke Party Wear Casual Shirt","attributes":{"Brand":"The Vanca","Product Code":"WSHIRT000TSF1886TVBLMM", "Color": "Red;White", "Size": "XL","Material": "Cotton"}},{"title":"Shipping Details","description":"This product is usually shipped in 1-3 days within Metro areas.","attributes":{"Estimated Arrival":"3-5 days","Return Policy":"We will gladly accept returns for any reason within 10 days of receipt of delivery. "}}],"other_rich_desc":null,"merchant_product_url":null,"promo_text":" ","actual_price":799,"offer_price":559,"tag":" ","convenience_fee":null,"product_rating":null,"autocode":null,"need_shipping":true,"bargainable":true,"image_url":"http://assets.paytm.com/images/catalog/product/C/CM/CMPLXWSHIRT000TSF1886TVBLLL/0x1280/70/5.jpg","product_created_date":null,"product_end_date":null,"status":true,"instock":true,"meta_title":"Buy The Vanca Western Wear Raglan Sleeveless Shirt Poly Georgette Fabric Nylon Lace Yoke Party Wear Casual Shirt Blue (Size-M) Online at Low Prices in India - Paytm.com","meta_description":"Paytm.com - Buy The Vanca Western Wear Raglan Sleeveless Shirt Poly Georgette Fabric Nylon Lace Yoke Party Wear Casual Shirt Blue (Size-M) online at best prices in India on Paytm.com","meta_keyword":"","vertical_id":2,"vertical_label":"Apparel","merchant":{"merchant_id":20237,"merchant_name":"Smartaccy","merchant_image":"","selling_since":"2014-06-13T08:13:59.000Z","stores":[{"store_name":"Alaukik Accessories","store_image":""}]},"productName":"The Vanca Western Wear Raglan Sleeveless Shirt Poly Georgette Fabric Nylon Lace Yoke Party Wear Casual Shirt Blue (Size-M) by Smartaccy","attribute_chart":{},"quantity":"10000","ancestors":[],"other_images":[]},
					198045 : {"product_id":198045,"product_type":"product","name":"Miss Chase Big Is Beautiful Oversized Top (Size-S)","bargain_name":"Miss Chase Big Is Beautiful Oversized Top (Size-S)","url":"https://catalogapidev.paytm.com/v1/mobile/product/198045","short_desc":"","long_rich_desc":[{"title":"Description","description":"This Uber Comfortable Off The Shoulder Crop Top Is Super Stylish Style Tip: Pair With Neutral Bottoms Like Black Or Blue  Or Pair With Colored Bottoms Wear Brightly Colored Accessories For A Fun Pop","attributes":{"Brand":"Miss Chase","Product Code":"WTOPSSP_01_15_05MCGNSS"}},{"title":"Shipping Details","description":"This product is usually shipped in 2-4 days within Metro areas.","attributes":{"Estimated Arrival":"4-6 days","Return Policy":"We will gladly accept returns for any reason within 10 days of receipt of delivery. "}}],"other_rich_desc":null,"merchant_product_url":null,"promo_text":" ","actual_price":799,"offer_price":799,"tag":" ","convenience_fee":null,"product_rating":null,"autocode":null,"need_shipping":true,"bargainable":true,"image_url":"http://assets.paytm.com/images/catalog/product/C/CM/CMPLXWTOPSSP_01_15_05MCGNLL/0x1280/70/0.jpg","product_created_date":null,"product_end_date":null,"status":true,"instock":true,"meta_title":"Buy Miss Chase Big Is Beautiful Oversized Top (Size-S) Online at Low Prices in India - Paytm.com","meta_description":"Paytm.com - Buy Miss Chase Big Is Beautiful Oversized Top (Size-S) online at best prices in India on Paytm.com","meta_keyword":"","vertical_id":2,"vertical_label":"Apparel","merchant":{"merchant_id":null,"merchant_name":null,"merchant_image":"","selling_since":null,"stores":[{"store_name":null,"store_image":""}]},"productName":"Miss Chase Big Is Beautiful Oversized Top (Size-S)","attribute_chart":{},"quantity":"10000","ancestors":[{"name":"Women","id":5170,"url_key":"women"},{"name":"Western Wear","id":5180,"url_key":"women/clothes-western"},{"name":"Tops & Tunics","id":5232,"url_key":"women/clothes-western/tops-tunics"},{"name":"Miss Chase Big Is Beautiful Oversized Top (Size-S)","id":"","url_key":""}],"other_images":[]},
					198034 : {"product_id":198034,"product_type":"product","name":"Miss Chase Flare For Fashion (Size-S)","bargain_name":"Miss Chase Flare For Fashion (Size-S)","url":"https://catalogapidev.paytm.com/v1/mobile/product/198034","short_desc":"","long_rich_desc":[{"title":"Description","description":"This Adorable Pop Colored Balloon Blouse Is Perfect For All Body Types Its Flowy And Airy Silhoutte Drapes Your Body Beautifully Style Tip: Since The Blouse Is Extremely Loose And Flowy  It Needs To Be Paired With Fitted Bottoms  Whether It Is A Skirt  Shorts  Or Skinny Jeans. Try To Keep Your Neck Bare, And Accessorize With Drop Earrings","attributes":{"Brand":"Miss Chase","Product Code":"WTOPSSP_02_07_31MCCBSS"}},{"title":"Shipping Details","description":"This product is usually shipped in 2-4 days within Metro areas.","attributes":{"Estimated Arrival":"4-6 days","Return Policy":"We will gladly accept returns for any reason within 10 days of receipt of delivery. "}}],"other_rich_desc":null,"merchant_product_url":null,"promo_text":" ","actual_price":999,"offer_price":999,"tag":" ","convenience_fee":null,"product_rating":null,"autocode":null,"need_shipping":true,"bargainable":true,"image_url":"http://assets.paytm.com/images/catalog/product/C/CM/CMPLXWTOPSSP_02_07_31MCCBLL/0x1280/70/0.jpg","product_created_date":null,"product_end_date":null,"status":true,"instock":true,"meta_title":"Buy Miss Chase Flare For Fashion (Size-S) Online at Low Prices in India - Paytm.com","meta_description":"Paytm.com - Buy Miss Chase Flare For Fashion (Size-S) online at best prices in India on Paytm.com","meta_keyword":"","vertical_id":2,"vertical_label":"Apparel","merchant":{"merchant_id":null,"merchant_name":null,"merchant_image":"","selling_since":null,"stores":[{"store_name":null,"store_image":""}]},"productName":"Miss Chase Flare For Fashion (Size-S)","attribute_chart":{},"quantity":"10000","ancestors":[{"name":"Women","id":5170,"url_key":"women"},{"name":"Western Wear","id":5180,"url_key":"women/clothes-western"},{"name":"Tops & Tunics","id":5232,"url_key":"women/clothes-western/tops-tunics"},{"name":"Miss Chase Flare For Fashion (Size-S)","id":"","url_key":""}],"other_images":[]}
				}

				$scope.getProductMessageObj = function(productId){
					return products[productId]; // You have it your scope.product
				};

				$scope.gotoProduct = function(link){
					$location.path(link);
				};

				$scope.$on('PaytmIM.NavigateToProduct', function(event, product){
					//Handle: Application of navigation of product on UI.
					console.log("Product Link Clicked");
				});

				$scope.$on('PaytmIM.ShowLoading', function(event, isLoading){
					//Handle: Show and hide loading. Loading should anyways timeout after 5-10 secs
					console.log("Loading : ", isLoading);
				});

				$scope.$on('PaytmIM.ApplyPromoCode', function(event, promoCodeObj){
					//Handle: Application of promocode on UI.
					alert("Application of promo code clicked");
				});

				$scope.$on('PaytmIM.NoMerchantAgent', function(event){
					//Handle: Show message on UI.
					console.log("No merchant agent is available for chat");
				});

				$scope.$on('PaytmIM.ProductAlreadyBargaining', function(event, product){
					//Handle: Show message on UI.
					alert("Product Already under bargain");
				});

				$scope.$on('PaytmIM.MaxBargainLimitReached', function(event, maxBargainLimit){
					//Handle: Show message on UI.
					alert("Maximum concurrent bargain limit reached.");
				});

				// This is user detail section
				$scope.getUserDetail = function(){
					var user = {
						login : Globals.AppConfig.UserLogin,
						accessToken : Globals.AppConfig.UserToken,
						user_id : '11065430',
					}
					return user;
				}

				$scope.createBargainObj = function(productId){
					var bargainObj = {
						user: $scope.getUserDetail(),
						product : $scope.getProductMessageObj(productId)
					}
					return bargainObj;
				};

				$scope.bargain = function(productId){
					var bargainObj = $scope.createBargainObj(productId);
					$rootScope.$broadcast('initiateBargain', bargainObj);
				};

				// Call this if a user is explicitly signing off from Paytm.
				$scope.clearLocalStorage = function(){
					$rootScope.$broadcast('Clear-Local-Storage');
				}
			}
    	]);
})(angular);