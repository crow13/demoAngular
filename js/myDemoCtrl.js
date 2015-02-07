var app = angular.module("myDemoApp", ['ngDialog']);

app.controller("myDemoCtrl", function($scope, $http, ngDialog) {
    $scope.init = function() {
    	//make black background run full height regardless of what is inside
    	var screenHeight = screen.height,
    		blackDrop = document.getElementById('backdrop');
    	blackDrop.style.height = screenHeight+"px";
    };

    $scope.search = function() {
    	var urlInput = 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=2q5jxgutpb2zk3uwunbcawbx&callback=JSON_CALLBACK&q='+document.getElementById("searhcMovieInput").value;
      	$http({method: 'JSONP', url: urlInput}).
	        success(function(data, status) {
	          $scope.movies = angular.fromJson(data.movies);
	          document.getElementById("searchArea").style.display = "none";
	          document.getElementById("results").style.display = "block";
	          document.getElementById("topRight").style.display = "block";
	          document.getElementById("carousel").style.height = "250px";
	          document.getElementById("carousel").style.width = $scope.movies.length*225+'px';
	        }
        );
	};

	$scope.backToSearch = function() {
		document.getElementById("searchArea").style.display = "block";
		document.getElementById("results").style.display = "none";
		document.getElementById("topRight").style.display = "none";
		document.getElementById("carousel").style.height = "250px";
		document.getElementById("carousel").style.width = "0";
	}

	$scope.carouselPrevClicked = function() {

	};

	$scope.carouselNextClicked = function() {

	};

	$scope.showDataCard = function(elementInfo) {
		console.log(elementInfo.movie);
		$scope.open(elementInfo.movie);
	}

 	$scope.modalShown = false;
 	$scope.toggleModal = function(movieInput) {
 		console.log(movieInput);
 		$scope.modalData = movieInput;
    	$scope.modalShown = !$scope.modalShown;
	};
});

app.directive('modalDialog', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
        scope.show = false;
      };
    },
    template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hideModal()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>X</div><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
  };
});

