'use strict';

angular.module('myApp.view1', ['ngRoute', 'ngJsonExportExcel'])

	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/view1', {
			templateUrl: 'view1/view1.html',
			controller: 'View1Ctrl'
		});
	}])

	.controller('View1Ctrl', ['$http', '$scope', function ($http, $scope) {
		$scope.offers = [];
		$scope.categories = [];
		$scope.subcategories = [];
		$scope.searchSubcategories = searchSubcategories;
		$scope.searchItens = searchItens;
		var numPages = 1;
		var url = "";
		var offers = [];
		var categories = [];
		var subcategories = [];

		getAllCategories();

		function searchSubcategories(categoryId) {
			var categoryURL = "http://sandbox.buscape.com/service/findCategoryList/412f4b4a4268414258674d3d/BR/?format=json&categoryId=";
			categoryURL = categoryURL.concat(categoryId);
			$http.get(categoryURL).then(getSubCategoriesSuccessCallback, function (data) {
				console.log(data);
			});

		}

		function getSubCategoriesSuccessCallback(data) {
			console.log(data);
			subcategories = data.data.subcategory;
			$scope.subcategories = subcategories;
			$scope.showSubcategories = true;
		}

		function searchItens(subcategoryId, categoryId, brand) {
			url = "http://sandbox.buscape.com.br/service/findOfferList/buscape/7a31786c4e5646517a6a733d/BR/?results=100&allowedSellers=176377&format=json&categoryId=";
			if (subcategoryId) {
				url = url.concat(subcategoryId);
			}
			else {
				url = url.concat(categoryId);
			}

			if (brand && brand !== "") {
				url = url.concat("&keyword=");
				url = url.concat(brand);
			}
			$http.get(url).then(successCallback, function (data) {
				console.log(data);
			});
		}


		function getAllCategories() {
			$http.get("http://sandbox.buscape.com/service/findCategoryList/412f4b4a4268414258674d3d/BR/?categoryId=249&format=json").then(getCategoriesSuccessCallback, function (data) {
				console.log(data);
			});
		}

		function getCategoriesSuccessCallback(data) {
			console.log(data);
			categories = data.data.subcategory;
			$scope.categories = categories;


		}

		function successCallback(data) {
			var offerData = data.data;
			var numPages = offerData.totalpages;
			url = url.concat("&page=");
			getAllPages(numPages);

		}

		function getAllPages(numPages) {
			var fullURL = "";
			var page = 0;
			var allOffers = [];
			for (page = 1; page <= numPages; page++) {
				fullURL = url.concat(page);
				$http.get(fullURL).then(function (data) {
					allOffers = [];
					angular.forEach(data.data.offer, function (item, key) {
						item.offer.price = item.offer.price.value;
						item.offer.thumbnail = item.offer.thumbnail.url;
						item.offer.thumbnail = item.offer.thumbnail.replace("T100x100", "T200x200");
						item.offer.sellerId = item.offer.seller.id;
						item.offer.sellerName = item.offer.seller.sellername;
						allOffers.push(item.offer);
					});
					offers = offers.concat(allOffers);
					if ((data.data.page) === numPages) {
						downloadJSON(offers);
					}
				}, function (data) {
					console.log(data);
				});
			}
		}

		function downloadJSON(offers) {
			console.log(offers);
			$scope.offers = offers;
			$scope.showExport = true;
			/*			var filename = "download.json";
			
						if (typeof offers === 'object') {
							offers = JSON.stringify(offers, undefined, 2);
						}
						var blob = new Blob([offers], { type: 'text/json' });
			
						// FOR IE:
			
						if (window.navigator && window.navigator.msSaveOrOpenBlob) {
							window.navigator.msSaveOrOpenBlob(blob, filename);
						}
						else {
							var e = document.createEvent('MouseEvents'),
								a = document.createElement('a');
			
							a.download = filename;
							a.href = window.URL.createObjectURL(blob);
							a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
							e.initEvent('click', true, false, window,
								0, 0, 0, 0, 0, false, false, false, false, 0, null);
							a.dispatchEvent(e);
						}*/
		}

	}]);