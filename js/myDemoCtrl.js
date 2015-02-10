var app = angular.module("myDemoApp", ['ngDialog']),
  showCss = {css:{display:'block',alpha:1}},
  hideCss = {css:{alpha:0, display:'none'}};

app.controller("myDemoCtrl", function($scope, $http, ngDialog) {
    $scope.init = function() {
    	//make black background run full height regardless of what is inside
      window.onresize();
    };



    $scope.search = function() {
    	var urlInput = 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=2q5jxgutpb2zk3uwunbcawbx&callback=JSON_CALLBACK&q='+document.getElementById("searhcMovieInput").value;
      	$http({method: 'JSONP', url: urlInput}).
	        success(function(data, status) {
	          $scope.movies = angular.fromJson(data.movies);
            var carousel = document.getElementById("carousel"),
              carNext = document.getElementById('carNext'),
              carWidth = data.movies.length * 280;

            //reset the carousel
            carNext.style.opacity = 0;
            document.getElementById('carPrev').style.opacity = 0;
            carousel.style.left = "0";
            carousel.setAttribute("offToTheLeft","0");
            carousel.style.width = carWidth + "px";

            //Paint
            var tl = new TimelineLite();
            
            tl.to(document.getElementById('searchArea'), 0.5, hideCss, "+=0.5");
            tl.to(document.getElementById('results'), 0.5, showCss);
            tl.to(document.getElementById('topRight'), 0.5, showCss);

            if(parseInt(carousel.style.width) > screen.width){
              tl.to(carNext, 0.5, showCss);
            }
            window.resize;
	        }
        );
    };

    $scope.backToSearch = function() {
      var results = document.getElementById('results'),
          topRight = document.getElementById('topRight'),
          carousel = document.getElementById('carousel'),
          searchArea = document.getElementById('searchArea');
          
      var tl = new TimelineLite();

      tl.to(results, 0.5, hideCss);
      tl.to(topRight, 0.5, hideCss, "+=0.5");
      tl.to(searchArea, 0.5, showCss);
      carousel.style.width = 0;
    };

  	$scope.carouselPrevClicked = function() {
      var carousel = document.getElementById('carousel'),
        atNow = parseInt(carousel.getAttribute("offToTheLeft")),
        rightWall = parseInt(carousel.style.width) - screen.width,
        tl = new TimelineLite();
      rightWall = 0 - rightWall;

      if(atNow < 0){
        atNow += document.getElementById("carousel").getElementsByTagName("li")[0].offsetWidth;
        carousel.setAttribute("offToTheLeft",atNow);
        tl.to(carousel, 0.5, {css:{left:atNow + 'px'}})
      };

      if(atNow >= 0){
          tl.to(document.getElementById('carPrev'), 0.5, hideCss);
      }
      if(atNow >= rightWall && document.getElementById('carNext').style.opacity == "0"){
          tl.to(document.getElementById('carNext'), 0.5, showCss);
      }
  	};

  	$scope.carouselNextClicked = function() {
      var carousel = document.getElementById('carousel'),
        atNow = parseInt(carousel.getAttribute("offToTheLeft")),
        rightWall = parseInt(carousel.style.width) - screen.width,
        tl = new TimelineLite();
      rightWall = 0 - rightWall;
        atNow -= document.getElementById("carousel").getElementsByTagName("li")[0].offsetWidth;

      if(atNow >= rightWall){
        carousel.setAttribute("offToTheLeft",atNow);
        tl.to(carousel, 0.5, {css:{left:atNow + 'px'}})
      }

      if(atNow < 0){
          tl.to(document.getElementById('carPrev'), 0.5, showCss);
      }
      if(atNow < rightWall){
          tl.to(document.getElementById('carNext'), 0.5, hideCss);
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

window.onresize = function(event){
  var backdrop = document.getElementById("backdrop"),
    content = document.getElementById("content");

  //if you're on the second page
  if(document.getElementById('carousel').style.width != ""){
    var scrollTop     = $(window).scrollTop(),
      elementOffset = $(document.getElementById('carousel')).offset().top,
      distance      = (elementOffset - scrollTop) + $(document.getElementById('carousel')).outerHeight();
    backdrop.style.height = distance + "px";
    content.style.height = distance + "px";
  } else {
    backdrop.style.height = content.style.height = window.innerHeight + "px";
  }
  content.style.overflow = 'hidden';
};
