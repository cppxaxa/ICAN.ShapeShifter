

// Note:
// 
// Note, instead of this we are using self (to retain this pointer)
// Reference https://stackoverflow.com/a/4700899/6484802
//
// Note, the fastapi transacts with the JS with valid json as string
// so, we need to do JSON.parse() and JSON.stringify() to support
// 
// All sequences are here

function bl_default()
{
    // Initialize normal
    // Start the wake word listener
    // After detecting a wake word, start recording
    // Send the recording to the server
    bl_default.prototype.initializeNormal = function() {
        console.log("[INFO] BL initializeNormal");

        var self = this;

        this.controller = webClientController();
        this.backendToken = "";
        setAppIconRed();

        this.controller.initialize();

        // Strictly preparation/ override first, then initialization

        this.controller.callbackTranscriptionService = function(response) {
            console.log("[INFO] BL callbackTranscriptionService ", response);
            self.controller.status["transcriptionStartTime"] = null;
            var jsonResponse = JSON.parse(response);
            if (typeof jsonResponse == 'object' && "token" in jsonResponse) {
                self.backendToken = jsonResponse["token"];
                setAppIconWhite();
                console.log("[INFO] BL token found and updated");
            }
            else {
                console.log("[INFO] BL transcriptionService: token not found in response");
                self.backendToken = "";
                setAppIconRed();
            }
        }
        this.controller.onWavRecordingFinished = function(blob) {
            console.log("[INFO] BL onWavRecordingFinished " + blob);
            hideRecognitionStartedUI();
            setAppIconRed();
            self.controller.invokeTranscriptionService(self.backendToken, blob);
        }
        this.controller.onWakeWordDetected = function(word) {
            if (word != "up") {
                console.log("\t[INFO] BL onWakeWordDetected - Uninteresting wake word, ignoring", word);
                return;
            }
            else {
                console.log("[INFO] BL onWakeWordDetected", word, 
                "\nconfigData", self.controller.getConfig(), 
                "\nstatus", self.controller.getStatus());
            }

            var success = self.blStartWavRecording();

            if (!success) {
                console.log("[INFO] Ignoring interesting wake word because transcription in progress");
            }
        }
        this.controller.initWakeWordDetection();
    }

    bl_default.prototype.blStartWavRecording = function() {
        console.log("[INFO] BL blStartWavRecording");
        if (this.controller.getStatus()["transcriptionStartTime"] == null ||
            Date.now() - this.controller.getStatus()["transcriptionStartTime"] > this.controller.getConfig()["recordingTimeLimitInSeconds"]
            ) {
            this.controller.updateStatus({"transcriptionStartTime": Date.now()});
            this.controller.startWavRecording(
                this.controller.getConfig()["recordingMinTimeInSeconds"], 
                this.controller.getConfig()["recordingTimeLimitInSeconds"]);
            showRecognitionStartedUI();
            return true;
        }
        else {
            return false;
        }
    }

    bl_default.prototype.queryConfig = function() {
        console.log("[INFO] BL queryConfig - INCOMPLETE");
    }

    // bl_default.prototype.sampleCall = function() {
    //     bl_default.prototype.queryConfig();
    //     console.log("[INFO] BL sampleCall", this.backendToken);
    // }

    // bl_default.prototype.showLoginToken = function() {
    //     console.log("[INFO] BL showLoginToken", this.backendToken);
    // }

    bl_default.prototype.logIntoServer = function(loginId, password) {
        console.log("[INFO] BL logIntoServer");
        var self = this;
        $.post(window.location.origin + '/v1/login', 
            JSON.stringify({ loginId: loginId, password: password }), 
            function(data) {
                if (typeof data == 'object' && "token" in data) {
                    console.log("[INFO] BL got a login token");
                    self.backendToken = data["token"];
                    setAppIconWhite();
                    showLoginSuccessDialog(3);
                }
                else {
                    console.log("[INFO] BL no login token found");
                    showLoginErrorDialog(8);
                }
            }, "json");
    }
}


// Actual invocation

_bl = new bl_default();
_bl.initializeNormal();
_bl.queryConfig();
_bl.controller.setConfig({
    "recordingMinTimeInSeconds": 2,
    "recordingTimeLimitInSeconds": 4,
    "transcriptionServiceUrl": window.location.origin + "/v1/transcribe_file"
});

