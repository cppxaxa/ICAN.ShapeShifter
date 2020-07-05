
// Capabilities are here
// We offer stateful functions and callbacks

function webClientController()
{
    var controller = {};
    
    controller["initialize"] = function() {
        this.configData = {};
        this.status = {
            "transcriptionStartTime": null
        };    
    }

    controller["sayHello"] = function() {
        alert("Hello");
    }

    controller["setConfig"] = function(configData) {
        this.configData = configData;
        // console.log("[INFO] setConfig ", this.configData);
    }

    controller["getConfig"] = function() {
        // console.log("[INFO] getConfig ", this.configData);
        return this.configData;
    }

    controller["updateStatus"] = function(unit) {
        Object.assign(this.status, unit);
    }

    controller["getStatus"] = function() {
        return this.status;
    }

    controller["initWakeWordDetection"] = function() {
        console.log("[INFO] initWakeWordDetection");
        wakeWordApp(controller.onWakeWordDetected);
    }

    controller["onWakeWordDetected"] = function(word) {
        console.log("[INFO] onWakeWordDetected " + word);
    }

    controller["log"] = function (msg) {
        console.log("[INFO] Controller log: " + msg);
    }

    controller["startWavRecording"] = function(minSeconds = 2, limSeconds = 4, consecutiveSilenceSeconds = 1.5) {
        console.log("[INFO] startWavRecording for minSeconds", minSeconds, "consecutiveSilenceSeconds", consecutiveSilenceSeconds, "time limit", limSeconds);
        onWavRecordingFinishedCustomCallback = controller["onWavRecordingFinished"];
        
        this.status["transcriptionStartTime"] = Date.now();

        startWavRecording(minSeconds, limSeconds, consecutiveSilenceSeconds);
    }

    controller["stopWavRecording"] = function() {
        console.log("[INFO] stopWavRecording");
        stopWavRecording();
    }

    controller["onWavRecordingFinished"] = function(blob) {
        console.log("[INFO] onWavRecordingFinished " + blob);
    }

    controller["invokeTranscriptionService"] = function(backendToken, blob) {
        console.log("[INFO] invokeTranscriptionService", this.configData["transcriptionServiceUrl"], blob);
        transcribeWavBlob(backendToken, this.configData["transcriptionServiceUrl"], blob, controller["callbackTranscriptionService"]);
    }

    controller["callbackTranscriptionService"] = function(response) {
        console.log("[INFO] callbackTranscriptionService", response);
    }

    return controller;
}