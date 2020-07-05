function startWavRecording(minSeconds = 2, limSeconds = 0, consecutiveSilenceSeconds = 1) {
	console.log("[INFO] recordButton clicked, limSeconds: " + limSeconds);

	/*
		Simple constraints object, for more advanced audio features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/
    
    var constraints = { audio: true, video:false }

	/*
    	We're using the standard promise based getUserMedia() 
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		console.log("[INFO] getUserMedia() success, stream created, initializing Recorder.js ...");

		/*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device

		*/
		audioContext = new AudioContext();

		//update the format 
		console.log("\t[INFO] Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz");

		/*  assign to gumStream for later use  */
		gumStream = stream;
		
		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);

		/* 
			Create the Recorder object and configure to record mono sound (1 channel)
			Recording 2 channels  will double the file size
		*/
        rec = new Recorder(input, 
            {
                numChannels:1,
                minSeconds: minSeconds,
                limSeconds: limSeconds, 
                consecutiveSilenceSeconds: consecutiveSilenceSeconds,
                volumeMultiplier: 0.9
            }, 
            onRecordingFinished);

		//start the recording process
		rec.record();

		console.log("[INFO] Recording started");

	}).catch(function(err) {
        console.log("\t[INFO] Start Recording failed", err);
	});
}

// function pauseWavRecording(){
// 	console.log("pauseButton clicked rec.recording=",rec.recording );
// 	if (rec.recording){
// 		//pause
// 		rec.stop();
// 		pauseButton.innerHTML="Resume";
// 	}else{
// 		//resume
// 		rec.record()
// 		pauseButton.innerHTML="Pause";

// 	}
// }

function stopWavRecording() {
	console.log("[INFO] stopButton clicked");
	rec.stop();
}

function onRecordingFinished() {
    console.log("[INFO] onRecordingFinish");

    //stop microphone access
    gumStream.getAudioTracks()[0].stop();

    //create the wav blob and pass it on to createDownloadLink
    // rec.exportWAV(createDownloadLink);

    if (onWavRecordingFinishedCustomCallback != null)
        rec.exportWAV(onWavRecordingFinishedCustomCallback);
}

var onWavRecordingFinishedCustomCallback = null;

// function createDownloadLink(blob) {
	
// 	var url = URL.createObjectURL(blob);
// 	var au = document.createElement('audio');
// 	var li = document.createElement('li');
// 	var link = document.createElement('a');

// 	//name of .wav file to use during upload and download (without extendion)
// 	var filename = new Date().toISOString();

// 	//add controls to the <audio> element
// 	au.controls = true;
// 	au.src = url;

// 	//save to disk link
// 	link.href = url;
// 	link.download = filename+".wav"; //download forces the browser to donwload the file using the  filename
// 	link.innerHTML = "Save to disk";

// 	//add the new audio element to li
// 	li.appendChild(au);
	
// 	//add the filename to the li
// 	li.appendChild(document.createTextNode(filename+".wav "))

// 	//add the save to disk link to li
// 	li.appendChild(link);
	
// 	//upload link
// 	var upload = document.createElement('a');
// 	upload.href="#";
// 	upload.innerHTML = "Upload";
// 	upload.addEventListener("click", function(event){
// 		  var xhr=new XMLHttpRequest();
// 		  xhr.onload=function(e) {
// 		      if(this.readyState === 4) {
// 		          console.log("Server returned: ",e.target.responseText);
// 		      }
// 		  };
// 		  var fd=new FormData();
//           fd.append("file",blob, filename);
//           fd.append("beam", false);
// 		  xhr.open("POST","http://192.168.43.2:5000/transcribe_file",true);
// 		  xhr.send(fd);
// 	})
// 	li.appendChild(document.createTextNode (" "))//add a space in between
// 	li.appendChild(upload)//add the upload link to li

// 	//add the li element to the ol
// 	recordingsList.appendChild(li);
// }
