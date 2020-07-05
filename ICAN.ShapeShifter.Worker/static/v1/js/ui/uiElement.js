
var snackbarContainer = null;
var showRecognitionStartedUI = function() {
    console.log("[INFO] UI showRecognitionStartedUI");
    var data = {
        message: '',
        timeout: 4000
    };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
};
var hideRecognitionStartedUI = function() {
    console.log("[INFO] UI hideRecognitionStartedUI");
    if (snackbarContainer.MaterialSnackbar.cleanup_)
        snackbarContainer.MaterialSnackbar.cleanup_();
    else
        snackbarContainer.classList.remove("mdl-snackbar--active");
}

var loginDialog = null;
var showLoginDialog = function() {
    console.log("[INFO] UI showLoginDialog");
    loginDialog.showModal();
}

var loginDialogWithClose = null;
var showloginDialogWithClose = function(timeoutSeconds = 0) {
    console.log("[INFO] UI loginDialogWithClose show")
    loginDialogWithClose.showModal();

    if (timeoutSeconds > 0)
        setTimeout(hideloginDialogWithClose, timeoutSeconds * 1000);
};
var hideloginDialogWithClose = function() {
    console.log("[INFO] UI loginDialogWithClose hide");
    loginDialogWithClose.close();
};

var loginErrorDialog = null;
var showLoginErrorDialog = function(timeoutSeconds = 0) {
    console.log("[INFO] UI loginErrorDialog show")
    loginErrorDialog.showModal();
};
var hideLoginErrorDialog = function() {
    console.log("[INFO] UI loginErrorDialog hide");
    loginErrorDialog.close();
    showLoginDialog();
};

var loginSuccessDialog = null;
var showLoginSuccessDialog = function(timeoutSeconds = 0) {
    console.log("[INFO] UI loginSuccessDialog show")
    loginSuccessDialog.showModal();

    if (timeoutSeconds > 0)
        setTimeout(hideLoginSuccessDialog, timeoutSeconds * 1000);
};
var hideLoginSuccessDialog = function() {
    console.log("[INFO] UI loginSuccessDialog hide");
    loginSuccessDialog.close();
};


var appIcon = null;
var setAppIconRed = function() {
    console.log("[INFO] UI setAppIconRed");
    $("#appIcon").css("color", "red");

    // setTimeout(setAppIconWhite, 8000);
}
var setAppIconWhite = function() {
    console.log("[INFO] UI setAppIconWhite");
    $("#appIcon").css("color", "white");
}

$(document).ready(function() {
    console.log("[INFO] UI Element Ready");

    $("#startRecording").click(function() {
        console.log("[INFO] UI Start button tapped");
        _bl.controller.startWavRecording();
    });

    $("#stopRecording").click(function() {
        console.log("[INFO] UI Stop button tapped");
        _bl.controller.stopWavRecording();
    });


    

    loginDialog = document.getElementById('loginDialog');
    if (!loginDialog.showModal) {
      dialogPolyfill.registerDialog(loginDialog);
    }
    $("#loginButton").click(function() {
        console.log("[INFO] UI Login window show")
        loginDialog.showModal();
    });
    $("#loginWindow_btnLogin").click(function() {
        console.log("[INFO] UI Login window login request");
        _bl.logIntoServer($("#loginWindow_txtLoginUsername").val(), $("#loginWindow_txtLoginPassword").val());
    });
    loginDialog.querySelector('.close').addEventListener('click', function() {
        console.log("[INFO] UI Login window close");
        loginDialog.close();
    });

    console.log("[INFO] UI Login window show at first")
    loginDialog.showModal();


    snackbarContainer = document.querySelector('#snackbar_recognitionStarted');
    

    loginDialogWithClose = document.getElementById('loginDialogWithClose');
    if (!loginDialogWithClose.showModal) {
        dialogPolyfill.registerDialog(loginDialogWithClose);
    }
    $("#loginDialogWithClose_btnLogin").click(function() {
        console.log("[INFO] UI Login window login request");
        _bl.logIntoServer($("#loginDialogWithClose_txtLoginUsername").val(), $("#loginDialogWithClose_txtLoginPassword").val());
    });
    $('#loginDialogWithClose .close').click(function() {
        console.log("[INFO] UI loginDialogWithClose close");
        loginDialogWithClose.close();
    });


    loginErrorDialog = document.getElementById('loginErrorDialog');
    if (!loginErrorDialog.showModal) {
        dialogPolyfill.registerDialog(loginErrorDialog);
    }
    loginErrorDialog.querySelector('.close').addEventListener('click', function() {
        console.log("[INFO] UI loginErrorDialog close");
        loginErrorDialog.close();
        showLoginDialog();
    });


    loginSuccessDialog = document.getElementById('loginSuccessDialog');
    if (!loginSuccessDialog.showModal) {
      dialogPolyfill.registerDialog(loginSuccessDialog);
    }
    loginSuccessDialog.querySelector('.close').addEventListener('click', function() {
        console.log("[INFO] UI loginSuccessDialog close");
        loginSuccessDialog.close();
    });


    $("#appIcon").click(showloginDialogWithClose);



    $("#queryCard_startWavRecording").click(function() {
        _bl.blStartWavRecording();
    });

    $(".fabStartWavRecording").click(function() {
        _bl.blStartWavRecording();
    });
    
});
