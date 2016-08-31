angular.module('starter')
.controller('LoginCtrl', function(
	$scope, 
	$ionicLoading, 
	$timeout, 
	$state, 
	$http, 
	$ionicPopup, 
	SNURL, 
	$rootScope,
	$cordovaOauth,
	$ionicModal,
	AuthService
){
	$scope.token = null;

	
	var agreement = '';


	$scope.readTextFile = function(file)
	{
	    var rawFile = new XMLHttpRequest();
	    rawFile.open("GET", file, false);
	    rawFile.onreadystatechange = function ()
	    {
	        if(rawFile.readyState === 4)
	        {
	            if(rawFile.status === 200 || rawFile.status == 0)
	            {
	                var allText = rawFile.responseText;
	                agreement = allText;
	            }
	        }
	    }
	    rawFile.send(null);
	}


	$scope.readTextFile("agreement.txt");

	$scope.checkIfLoggedIn = function(){
		// Check if Token is saved in local storage to see if user is logged in
		var isAutenticated = localStorage.getItem('token');
		if(isAutenticated){
			$ionicLoading.show();
			$timeout(function(){
				$ionicLoading.hide();
				$state.go('tab.home');
			}, 1000);
		}
	};

	$scope.login = function(email, password){
		AuthService.login(email, password);
	}
	
// -------------------------------------------------Social Login----------------------------------
	
	$scope.googleLogin = function(){
		$cordovaOauth.google("875167662896-f637cn01j1i4qb6cqjkhfi4q2722321e.apps.googleusercontent.com", ["email","profile"]).then(function(result){
		 	$scope.access_token = result.access_token;
		 	$scope.social_type = 'google';
		 	$ionicModal.fromTemplateUrl('views/login/create_password.html', {
			    scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal) {
				$scope.modal = modal;
				$scope.modal.show();
			});
		}, function(error) {
		    console.log("Error -> " + error);
		});
	};


	$scope.facebookLogin = function() {
        $cordovaOauth.facebook("1130684936954183", ["public_profile,email,user_about_me"]).then(function(result) {
    		$scope.access_token = result.access_token;
    		$scope.social_type = 'facebook';
		 	$ionicModal.fromTemplateUrl('views/login/create_password.html', {
			    scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal) {
				$scope.modal = modal;
				$scope.modal.show();
			});

        }, function(error) {
            console.log("Error -> " + error);
        });
    };
// -------------------------------------------------Social Login----------------------------------

	$scope.closeModal = function(){
		$scope.modal.hide();
		$scope.modal.remove();
	};

	$scope.getNewPassword = function(newPassword){

		$ionicPopup.show({
			title: 'End User License Agreement',
			template: agreement,
			scope: $scope,
			buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
			    text: 'Cancel',
			    type: 'button-assertive',
			    onTap: function(e){
			    	$scope.modal.hide();
			    	$scope.modal.remove();
			    }
			  }, {
			    text: 'AGREE',
			    type: 'button-positive',
			    onTap: function(e) {
			      // Returning a value will cause the promise to resolve with the given value.
			      $ionicLoading.show();
			      $http.post(SNURL+'authenticate/signup_oauth', {
			      	access_token: $scope.access_token,
			      	social_type: $scope.social_type,
			      	password: newPassword		
			      }).success(function(response){
			      	$scope.getCredentials(response, '', newPassword);
			      	$state.go('tab.home');
			      	$ionicLoading.hide();
			      	$scope.modal.hide();
			      	$scope.modal.remove();
			      })
			      .error(function(err){
			      	$ionicLoading.hide();
			      	$scope.modal.hide();
			      	$scope.modal.remove();
			      	$ionicPopup.alert({
			      		title: 'Error',
			      		template: 'You are already registered, please try login in',
			      		okType: 'button-assertive'
			      	});
			      });
			    }
			}]
		});



		
		
	}

	$scope.getCredentials = function(response, email, password){
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

	$scope.checkIfLoggedIn();
})




.controller('ReloginCtrl', function(
	$scope, 
	$http,  
	$ionicLoading, 
	$timeout, 
	$state,
	AuthService
){
	$scope.avatar = localStorage.getItem('user.avatar');
	$scope.email = localStorage.getItem('user.email');
	$scope.username = localStorage.getItem('user.name');
	$scope.password = localStorage.getItem('user.password');

	$scope.relogin = function(email, password){
		AuthService.login(email, password);
	}


	$scope.login = function(){
		AuthService.logout_no_loading();
	};
});