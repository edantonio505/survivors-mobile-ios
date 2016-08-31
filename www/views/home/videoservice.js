angular.module('starter')
.factory('videoService', function(){
	return video = {
		play: function(video, thumbnail){
			$thumbnail = document.getElementById(thumbnail);
			$video = document.getElementById(video);
			$thumbnail.style.display = 'none';
			$video.style.display = 'block';
			$video.requestFullscreen;
			if ($video.requestFullscreen) {
			  $video.requestFullscreen();
			} else if ($video.mozRequestFullScreen) {
			  $video.mozRequestFullScreen();
			} else if ($video.webkitRequestFullscreen) {
			  $video.webkitRequestFullscreen();
			} 
			$video.play();
			this.checkVideoStatus($video, $thumbnail);
		},
		checkVideoStatus: function(video, thumbnail){
			video.addEventListener("ended", function(){
				thumbnail.style.display = 'block';
				video.style.display = 'none';
			}, true);
		},

		getExtensionType: function(video){
			var ext = "."+video.substr(video.indexOf(".") + 1);
			var mimeType;
			if(ext == '.mp4'){
				mimeType = 'video/mp4';
			} else if(ext == '.mov'){
				mimeType = 'video/quicktime';
			} else if(ext == '.ogg' || ext == '.ogv' || ext == '.ogm'){
				mimeType = 'video/ogg';
			} else if(ext == '.webm'){
				mimeType = 'video/webm';
			} else if (ext == '.3gp'){
				mimeType = 'video/3gpp';
			} else {
				mimeType = 'video/mp4';
			}


			return {
				extension: ext,
				mimeType: mimeType 
			};	
		},

		getMimeTypeFromUrl: function(video){
			var ext = "."+video.split('.').pop();
			if(ext == '.mp4'){
				mimeType = 'video/mp4';
			} else if(ext == '.mov'){
				mimeType = 'video/quicktime';
			} else if(ext == '.ogg' || ext == '.ogv' || ext == '.ogm'){
				mimeType = 'video/ogg';
			} else if(ext == '.webm'){
				mimeType = 'video/webm';
			} else if (ext == '.3gp'){
				mimeType = 'video/3gpp';
			} else {
				mimeType = 'video/mp4';
			}

			return mimeType;
		},
	};

	return video;
});