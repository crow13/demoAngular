var app = angular.module("myDemoApp", ['ngDialog']);

app.controller("myDemoCtrl", function($scope, $http, ngDialog) {
    $scope.init = function() {
    	//make black background run full height regardless of what is inside
    	var screenHeight = screen.height,
    		blackDrop = document.getElementById('backdrop');
      //make sure the backdrop takes the whole height
    	blackDrop.style.height = screenHeight+"px";
      document.getElementById('carousel').setAttribute('offToTheLeft',0);
    };

    $scope.search = function() {
    	var urlInput = 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=2q5jxgutpb2zk3uwunbcawbx&callback=JSON_CALLBACK&q='+document.getElementById("searhcMovieInput").value;
      	$http({method: 'JSONP', url: urlInput}).
	        success(function(data, status) {
	          $scope.movies = angular.fromJson(data.movies);
            var tl = new TimelineLite();
            
            tl.to(document.getElementById('searchArea'), 0.5, {css:{alpha:0, display:'none'}}, "+=0.5");
            tl.to(document.getElementById('results'), 0.5, {css:{display:'block',alpha:1}});
            tl.to(document.getElementById('topRight'), 0.5, {css:{display:'block',alpha:1}});

	          document.getElementById("carousel").style.height = "250px";
	          document.getElementById("carousel").style.width = $scope.movies.length*250+'px';
	        }
        );
    };

    $scope.backToSearch = function() {
      var results = document.getElementById('results'),
          topRight = document.getElementById('topRight'),
          carousel = document.getElementById('carousel'),
          searchArea = document.getElementById('searchArea');
          
      var tl = new TimelineLite();

      tl.to(results, 0.5, {css:{alpha:0, display:'none'}});
      tl.to(topRight, 0.5, {css:{alpha:0, display:'none'}}, "+=0.5");
      tl.to(searchArea, 0.5, {css:{display:'block',alpha:1}});
      carousel.style.height = "0";
      carousel.style.width = "0";
    };

  	$scope.carouselPrevClicked = function() {
      var carousel = document.getElementById('carousel'),
        atNow = parseInt(carousel.getAttribute("offToTheLeft")),
        rightWall = parseInt(carousel.style.width) - screen.width;
      rightWall = 0 - rightWall;

      atNow += document.getElementById("carousel").getElementsByTagName("li")[0].offsetWidth;
      carousel.setAttribute("offToTheLeft",atNow);

      var tl = new TimelineLite();
      tl.to(carousel, 0.5, {css:{left:atNow + 'px'}})

      if(atNow >= 0){
          tl.to(document.getElementById('carPrev'), 0.5, {css:{alpha:0, display:'none'}});
      }
      if(atNow <= rightWall && document.getElementById('carNext').style.opacity == "0"){
          tl.to(document.getElementById('carNext'), 0.5, {css:{display:'block', alpha:1}});
      }
  	};

  	$scope.carouselNextClicked = function() {
      var carousel = document.getElementById('carousel'),
        atNow = parseInt(carousel.getAttribute("offToTheLeft")),
        rightWall = parseInt(carousel.style.width) - screen.width;
      rightWall = 0 - rightWall;

      atNow -= document.getElementById("carousel").getElementsByTagName("li")[0]. offsetWidth;
      carousel.setAttribute("offToTheLeft",atNow);

      var tl = new TimelineLite();
      tl.to(carousel, 0.5, {css:{left:atNow + 'px'}})

      if(atNow < 0){
          tl.to(document.getElementById('carPrev'), 0.5, {css:{display:'block', alpha:1}});
      }
      if(atNow < rightWall){
          tl.to(document.getElementById('carNext'), 0.5, {css:{alpha:0, display:'none'}});
      }
  	};

  	$scope.showDataCard = function(elementInfo) {
  		$scope.open(elementInfo.movie);
  	}

   	$scope.modalShown = false;

   	$scope.toggleModal = function(movieInput) {
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

