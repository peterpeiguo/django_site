$(document).ready(function() {
    function format_time(t) {
        t = Math.ceil(t);
        var s = t % 60;
        s = (s < 10) ? "0" + s : s;
        t = Math.floor(t / 60);
        var m = t % 60;
        m = (m < 10) ? "0" + m : m;
        h = Math.floor(t / 60);
        return h + ":" + m + ":" + s;
    }

    var update_seek_bar_value = function() {
        var seek_bar = $("#seek-bar")[0];
        var video = $("#video")[0];
        seek_bar.value = video.currentTime / video.duration * seek_bar.max;
        update_progress();
    }

    function update_progress() {
        var video = $("#video")[0];
        $("#progress_label").text(format_time(video.currentTime) + " / " + format_time(video.duration));
    }

    function full_screen() {
        var video = $("#video")[0];
        var video_container = $("#video-container")[0];
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen(); // Firefox
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen(); // Chrome and Safari
        }
    }

    // Event listener for the play/pause button
    $("#video").on("click", function() {
        var video = $("#video")[0];
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });

    $('#speed a').click(function() {
        $("#video")[0].playbackRate = parseFloat(this.innerHTML.substring(1, 4));
        $("#speed-button")[0].innerHTML = this.innerHTML;
    });    

    // Event listener for the mute button
    $("#mute").on("click", function() {
        var video = $("#video")[0];
        if (video.muted == false) {
          video.muted = true;
          this.innerHTML = "Unmute";
        } else {
          video.muted = false;
          this.innerHTML = "Mute";
        }
    });
    
    // Event listener for the full-screen button
    $("#full-screen").on("click", function() {
        full_screen();
    });
  
    // Event listener for the seek bar
    $("#seek-bar").on("change", function() {
        var video = $("#video");
        video[0].currentTime = video[0].duration * (this.value / this.max);
        video.on("timeupdate", update_seek_bar_value);
        update_progress();
    });

    // Update the seek bar as the video plays
    $("video").on("timeupdate", update_seek_bar_value);

    $("video").on("progress", function() {
        var buffered = this.buffered;
        var s = "";
        //var total = 0;
        for (index = 0; buffered.length != 0 && index < buffered.start.length && index < buffered.end.length; 
        index ++) {
            s = s + "["+buffered.start(index)+ "," + buffered.end(index)+"]";
            /*if (buffered.end(index) > this.currentTime) {
                total += buffered.end(index) - buffered.start(index);
            }*/
        }
        $("#preload_label").text(s/*total / (this.duration - this.currentTime)*/);
    });

    $("video").on("durationchange", function() {
        var seek_bar = $("#seek-bar")[0];
        if (seek_bar.max == 0) {
            $("#seek-bar")[0].max = this.duration;
            $("video").off("durationchange");
        }
    });

    $("#video").on("ended", function() {
        next_episode = $("#next_episode");
        if (next_episode.length > 0) {
            next_episode[0].click();
        } else {
          $("#seek-bar")[0].value = 0;
          $("#play-pause")[0].innerHTML = "Play";
        }
    });

    // Pause the video when the slider handle is being dragged
    $("#seek-bar").on("mousedown", function() {
        $("#video").off("timeupdate");
    });
  
    // Event listener for the volume bar
    $("#volume-bar").on("change", function() {
        $("#video")[0].volume = this.value / this.max;
    });
});