angular.module('starter')
.controller('ProfilePictureCtrl', function(
	$scope,
	$http,
	SNURL,
	$ionicPopup,
	$rootScope,
	$cordovaCamera,
	$ionicActionSheet,
	$ionicLoading,
	$cordovaFileTransfer
){
	$scope.username = localStorage.getItem('user.name');
	$scope.useravatar = localStorage.getItem('user.avatar');
	$scope.email =  localStorage.getItem('user.email');
	var token = localStorage.getItem('token');
	
	$scope.newUsername = function(){
		$ionicPopup.prompt({
		   title: 'New Name',
		   template: 'Please make it unique',
		   inputType: 'text',
		   cancelType: 'button-assertive'
		}).then(function(res) {
			$http.post(SNURL+'update_profile',{
				newUsername: res,
				email: $scope.email
			})
			.success(function(data){
				if(data == 'saved successfully')
				{
					localStorage.setItem('user.name', res);
					$scope.username = res;
					$rootScope.username = res;
				}

				if(data == 'Name is taken'){
					$ionicPopup.alert({
						title: 'Error',
						template: 'That username is already taken'
					});
				}
			});
		});
	};



	$scope.newProfilePic = function(){
		$ionicActionSheet.show({
		    buttons: [
		       { text: '<i class="ion-image"></i>'},
		       { text: '<i class="ion-camera"></i>'}
		    ],
		    titleText: 'Choose your source',
		    cancelText: 'Cancel',
		    cancel: function() {
		          // add cancel code..
		    },
		    buttonClicked: function(index) {
		       $scope.takePicture(index)
		       return true;
		    }
		});
	};



	$scope.takePicture = function(sourceType){
		var options = {
	      destinationType: Camera.DestinationType.FILE_URI,
	      sourceType: sourceType,
	      correctOrientation:true
	    };

	    $cordovaCamera.getPicture(options).then(function(imageURI) {
	    	var fileName = 'surivorsNetwork' + new Date().getTime() + ".jpg";
		    var options = {
			    fileKey: "file",
			    fileName: fileName,
			    httpMethod: "POST",
			    chunkedMode: true,
			    mimeType: "image/jpeg",
			    params: {
					email: $scope.email
			    }
			};

			$ionicLoading.show();
			$cordovaFileTransfer.upload(SNURL+'update_profile?token='+token, imageURI, options)
			.then(function(data) {
				var response = JSON.parse(data.response);
				localStorage.setItem('user.avatar', response.new_avatar);
				$scope.useravatar = response.new_avatar;
				$rootScope.avatar = response.new_avatar;
				$ionicLoading.hide();
			}, function(err) {
				$ionicLoading.hide();
				$ionicPopup.alert({
			     title: 'Error',
			     template: 'Check your internet connection or try again later.'
			   });
				// $scope.err = err;
				console.log(JSON.stringify(err));
			}, function (progress) {
				// constant progress updates
			});

	    }, function(err) {
	      $scope.err = err;
	    });
	};
});