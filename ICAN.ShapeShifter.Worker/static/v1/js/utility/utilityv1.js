

function transcribeWavBlob(backendToken, transcriptionUrl, blob, callback = null)
{
    console.log("[INFO] utilityv1 transcribeWavBlob");

    var filename = new Date().toISOString();
    var xhr=new XMLHttpRequest();
    xhr.onload=function(e) {
        if(this.readyState === 4) {
            console.log("\t[INFO] utilityv1 Server returned: ", e.target.responseText);
            callback(e.target.responseText);
        }
    };
    var fd=new FormData();
    fd.append("token", backendToken);
    fd.append("file",blob, filename);
    fd.append("beam", false);
    xhr.open("POST",transcriptionUrl,true);
    xhr.send(fd);
}

