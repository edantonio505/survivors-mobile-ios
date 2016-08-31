angular.module('starter')
.factory('AuthService', function(
	$ionicLoading, 
	$timeout, 
	$state, 
	$ionicHistory, 
	$rootScope, 
	$http, 
	SNURL,
	$ionicPopup
){
	
	function credentials(response, email, password){
		if(email == '')
		{
			email = response.email;
		}

		localStorage.setItem('token', response.token);
		localStorage.setItem('user.email', email);
		localStorage.setItem('user.password', password);
		localStorage.setItem('user.name', response.user_name);
		localStorage.setItem('user.avatar', response.user_avatar);
	};



	var token = {
		status: function(){
			var t = localStorage.getItem('token');
			if(!t){this.redirect_home();}
		},
		logout: function(){
			this.remove_Data();
			this.loading();
			
		},
		logout_no_loading: function(){
			this.remove_Data();
			$state.go('login');
		},

		loading: function(){
			$ionicLoading.show();
			$timeout(function(){
				$state.go('login');
				$ionicLoading.hide();
			}, 2000);
		},

		remove_Data: function(){
			$rootScope.notificationsCount = 0;
			$rootScope.notifications = [];
			$ionicHistory.clearHistory();
			$ionicHistory.clearCache();
			localStorage.removeItem('token');
			localStorage.removeItem('user.email');
			localStorage.removeItem('user.password');
			localStorage.removeItem('user.avatar');
			localStorage.removeItem('user.name');
		},

		redirect_home: function(){
			$rootScope.notificationsCount = 0;
			$rootScope.notifications = [];
			$ionicHistory.clearHistory();
			$ionicHistory.clearCache();
			localStorage.removeItem('token');


			$ionicLoading.show();
			$timeout(function(){
				$state.go('relogin');
				$ionicLoading.hide();
			}, 2000);
		},

		login: function(email, password){

			$ionicHistory.clearHistory();
			$ionicHistory.clearCache();
			$ionicLoading.show();
			$timeout(function(){
				$http.post(SNURL+'authenticate', {
					email: email,
					password: password
				})
				.success(function(response){
					if(response == 'user_banned')
					{
						$ionicPopup.alert({
							title: 'Banned',
							cssClass: 'color: red',
							template: 'You have been banned from SpeakOut for posting questionable content. If you think that this was a mistake please contact us.',
							okType: 'button-assertive'
						});
						$ionicLoading.hide();
					} else {
						if(response.log_count == 0)
						{
							$rootScope.notificationsCount = 0;
							$rootScope.notifications = [];
						} else {
							$rootScope.notificationsCount = response.log_count;
							$rootScope.notifications = response.event_logs;
						}
						credentials(response, email, password);
						$state.go('tab.home');
						$ionicLoading.hide();
					}
				})
				.error(function(err){
					$ionicPopup.alert({
						title: 'Error',
						cssClass: 'color: red',
						template: 'Could not retrieve your profile, please try again.',
						okType: 'button-assertive'
					});
					$ionicLoading.hide();
				});
			}, $timeout || 3000);		
		}	
	};

	return token;
})
.factory('Popup', function($ionicPopup){
	Popup = {
		showAlert: function(message) {
			$ionicPopup.alert({
				title: 'Error',
				template: message
			});
		}
	};

	return Popup;
})
.factory('UsersConnectionService', function(SNURL, $http, Popup, $rootScope){
	var AuthUserEmail = localStorage.getItem('user.email');

	var usersfunctions = {
		connect: function(username){
			$http.post(SNURL+'add_connection', {
				authenticated: AuthUserEmail,
				newConnection: username
			}).
			error(function(response){
				Popup.showAlert('Please check your internet connection');
			});
			return 'Waiting';
		}, 
		accept: function(username){
			$http.post(SNURL+'accept_connection', {
				authenticated: AuthUserEmail,
				acceptConnectionFrom: username
			}).
			error(function(err){
				console.log(err);
			});
			return 'Connected';
			$rootScope.connections_count += 1;
		}
	};
	return usersfunctions;
})
.factory('InspireService', function($http, SNURL){
	var authEmail = localStorage.getItem('user.email');
	var Inspire  = {
		inspired: function(topic_id){
			$inspireIcon = document.getElementById(topic_id+'-inspire');
			$inspiredCount = document.getElementById(topic_id+'-inspiredCount');
			if(angular.element($inspireIcon).hasClass('inspired'))
			{	
				$inspiredCount.innerHTML = Number($inspiredCount.innerHTML) - 1;
				angular.element($inspireIcon).removeClass('inspired');
				$http.get(SNURL+'topic/'+topic_id+'/'+authEmail+'/uninspire').
				error(function(err){
					alert('There was an Error');
				})
			}else {
				angular.element($inspireIcon).addClass('inspired');
				$inspiredCount.innerHTML = Number($inspiredCount.innerHTML) + 1;
				$http.get(SNURL+'topic/'+topic_id+'/'+authEmail+'/inspires').
				error(function(err){
					alert('There was an error');
				});
			}
		},
		inspiredClass: function(topic_id){
			$inspireIcon = document.getElementsByClassName(topic_id+'-inspire');
			$inspiredCount = document.getElementsByClassName(topic_id+'-inspiredCount');	
			if(angular.element($inspireIcon[0]).hasClass('inspired'))
			{	
				$inspiredCount[0].innerHTML = Number($inspiredCount[0].innerHTML) - 1;
				angular.element($inspireIcon).removeClass('inspired');
				$http.get(SNURL+'topic/'+topic_id+'/'+authEmail+'/uninspire').
				error(function(err){
					alert(err);
					console.log(err);
				})
			}else {
				angular.element($inspireIcon[0]).addClass('inspired');
				$inspiredCount[0].innerHTML = Number($inspiredCount[0].innerHTML) + 1;
				$http.get(SNURL+'topic/'+topic_id+'/'+authEmail+'/inspires').
				error(function(err){
					alert('There was an error');
				});
			}
		}

	};
	return Inspire;
})
.factory('socket', function ($rootScope, SNSOCKET) {
  var socket = io.connect(SNSOCKET);
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      }.bind(this));
    }
  };
});