angular.module('starter')
.factory('EventService', function(
	$rootScope, 
	$ionicHistory
){
  	$rootScope.newComments = 0;
  	$rootScope.newPost = 0;
	var eventFunctions = {
		handleEvents: function(data){
			if(data.type == 'new_comment')
			{$rootScope.newComments += 1;}
			if(data.type == 'user_inspired')
			{$rootScope.inspired_count += 1;}			
			if(data.type == 'user_accepted_connection')
			{$rootScope.connections_count += 1;}
			if(data.type == 'user_uninspired')
			{
				$rootScope.inspired_count -= 1;
			} else {
				if($ionicHistory.currentView().stateId != 'tab.notifications')
				{	if($rootScope.notificationsCount == undefined){
						$rootScope.notificationsCount = 0;
					}
					$rootScope.notificationsCount += 1;				
				}
				if(data.type != 'you_accepted_connection')
				{	
					if($rootScope.notifications == undefined)
					{
						$rootScope.notifications = [];
					}
					$rootScope.notifications.unshift(data);
				}
			}
			return $rootScope.notificationsCount;
		}, 
		handleNewPost: function(){
			$rootScope.newPost += 1;
		},
		handleProfileChanges: function(response){
			$rootScope.topics_count = response.user.topics_count;
			$rootScope.connections_count = response.user.connections_count;
			$rootScope.inspired_count = response.user.inspired_count;
		}
	};
	return eventFunctions;
});