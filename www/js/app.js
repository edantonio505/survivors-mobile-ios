angular.module('starter', [
      'ionic', 
      'ngCordova', 
      'ionicLazyLoad',
      'ngCordovaOauth',
      'angular-jwt',
      'ngTagsInput',
      "ngSanitize",
      "com.2fdevs.videogular",
      "com.2fdevs.videogular.plugins.controls",
      "com.2fdevs.videogular.plugins.overlayplay",
      "com.2fdevs.videogular.plugins.poster"])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.constant('SNURL', 'http://52.87.187.229/api/v1/')
.constant('SNSOCKET', 'http://52.87.187.229:6001')
// .constant('SNURL', 'http://survivorsnetwork.dev/api/v1/')
// .constant('SNSOCKET', 'http://survivorsnetwork.dev:6001')
.config(function($sceDelegateProvider, $ionicConfigProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'https://s3-us-west-2.amazonaws.com/edantonio505-survivors-network/**'
  ]);
  $ionicConfigProvider.scrolling.jsScrolling(false);
  $ionicConfigProvider.views.swipeBackEnabled(false);
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.views.maxCache(5);
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'views/tabs/tabs.html',
    controller: 'TabsCtrl'
  })
  .state('tab.user_profile', {
    url: '/user_profile/:topicId',
    views: {
      'tab-home': {
        templateUrl: 'views/user/profile.html',
        controller: 'UserProfileCtrl'
      }
    }
  })
  .state('tab.connection_profile', {
    url: '/connection_profile/:id',
    views: {
      'tab-network': {
        templateUrl: 'views/user/profile.html',
        controller: 'ConnectionProfileCtrl'
      }
    }
  })
  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'views/home/home.html',
        controller: 'HomeCtrl'
      }
    }
  })
  .state('tab.comments', {
    url: '/comments/:id',
    views: {
      'tab-home': {
        templateUrl: 'views/comments/comments.html',
        controller: 'CommentsCtrl'
      }
    }
  })
  .state('tab.comments_user', {
    url: '/user/comments/:name',
    views: {
      'tab-home': {
        templateUrl: 'views/user/profile.html',
        controller: 'CommentsUserCtrl'
      }
    }
  })
  .state('tab.home_topic',{
    url: '/topic/:id',
    views: {
      'tab-home': {
        templateUrl: 'views/topic/topic.html',
        controller: 'TopicCtrl'
      }
    }
  })
  .state('tab.profile_topic', {
    url: '/topic/:id',
    views: {
      'tab-profile' : {
        templateUrl: 'views/topic/topic.html',
        controller: 'TopicCtrl'
      }
    }
  })
  .state('tab.network_topic', {
    url: 'topic/:id',
    views: {
      'tab-network': {
        templateUrl: 'views/topic/topic.html',
        controller: 'TopicCtrl'
      }
    }
  })
  .state('tab.profile', {
    url: '/profile',
    views: {
      'tab-profile': {
        templateUrl: 'views/profile/profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })
  .state('tab.new', {
    url: '/new',
    views: {
      'tab-new': {
        templateUrl: 'views/new/new.html',
        controller: 'NewCtrl'
      }
    }
  })
  .state('tab.network', {
    url: '/network',
    views: {
      'tab-network':{
        templateUrl: 'views/network/network.html',
        controller: 'NetworkCtrl'
      }
    }
  })
  .state('tab.notifications', {
    url: '/notifications',
    views: {
      'tab-notifications': {
        templateUrl: 'views/notifications/notifications.html',
        controller: 'NotificationsCtrl'
      }
    }
  })
  .state('login', {
    url: '/login',
    templateUrl: 'views/login/login.html',
    controller: 'LoginCtrl'
  })
  .state('register', {
    url: '/register',
    templateUrl: 'views/register/register.html',
    controller: 'LoginCtrl'
  })
  .state('relogin', {
    url: '/relogin',
    templateUrl: 'views/login/relogin.html',
    controller: 'ReloginCtrl'
  })
  .state('tab.tag_category', {
    url: '/tag_category/:name',
    views:{
      'tab-home': {
        templateUrl: 'views/tabs/categories.html',
        controller: 'CategoriesCtrl'
      }
    }
  })
  .state('tab.changeProfile',{
    url: '/changeProfile',
    views: {
      'tab-home': {
        templateUrl: 'views/profilePicture/profilePicture.html', 
        controller: 'ProfilePictureCtrl'
      }
    }   
  })
  .state('tab.tag_category_topic', {
    url: '/category_topic/:id',
    views: {
      'tab-home': {
        templateUrl: 'views/topic/topic.html',
        controller: 'TopicCtrl'
      }
    }
  });
  $urlRouterProvider.otherwise('/login');
})

// ---------------------------------------------token refresh--------------------------------------------------------
.config(function Config($httpProvider, jwtInterceptorProvider) {
  jwtInterceptorProvider.tokenGetter = function() {
    return localStorage.getItem('token');
  }
  $httpProvider.interceptors.push('jwtInterceptor');
})


.config(function Config($httpProvider, jwtInterceptorProvider) {
  jwtInterceptorProvider.tokenGetter = function(jwtHelper, $http, SNURL) {
    var jwt = localStorage.getItem('token');
    if(jwt)
    {
      if (jwtHelper.isTokenExpired(jwt)) {
          // This is a promise of a JWT id_token
          return $http({
              url : SNURL+'delegate',
              skipAuthorization : true,
              method: 'GET',
              headers : { Authorization : 'Bearer '+ jwt},
          }).then(function(response){
              localStorage.setItem('token',response.data.token);
              return response.data.token;
          },function(response){
              localStorage.removeItem('token');                    
          });
        } else {
          return jwt;
        }
    }
  }
  $httpProvider.interceptors.push('jwtInterceptor');
})
// -----------------------------------------------------------------------------------------------------------


.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
})

.directive("cordovaVideo", function () {
  return {
    restrict: 'AEC',
    scope: {src: '=', type: '='},
    link: function(scope, element, attrs) {
      scope.$watch('src', function(newVal, oldVal) {
        if (scope.src != "") {
          // Create a div object
          var div = document.createElement('div');
          div.innerHTML = "<video id='video' class=\"video\" controls>"+
                          "<source src=\"" + scope.src + "\" type=\""+scope.type+"\">"+
                          "</video>";
          
          // Delete previous video if exists
          var previousDiv = document.getElementById('video');
          if (previousDiv)
            previousDiv.remove();

          // Append new <video> tag into the DOM
          element.append(div);
        }

      });
    }
  }
});