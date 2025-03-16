document.addEventListener("DOMContentLoaded", function () {
    const startBtn = document.getElementById("startRecording");
    const stopBtn = document.getElementById("stopRecording");

    // Load recording state
    chrome.storage.local.get("isRecording", (data) => {
        console.log('popup chrome isRecording data: ', data);
        if (data.isRecording) {
            startBtn.disabled = true;
            stopBtn.disabled = false;
        } else {
            startBtn.disabled = false;
            stopBtn.disabled = true;
        }
    });

    startBtn.addEventListener("click", function () {
        console.log('startRecording click event');
        // chrome.runtime.sendMessage({ action: "startRecording" });
        
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "startRecording" }, () => {
                console.log("📩 Sent startRecording to content.js");
            });
            chrome.runtime.sendMessage({ action: "startRecording" });
        });
        startBtn.disabled = true;
        stopBtn.disabled = false;


    });

    stopBtn.addEventListener("click", function () {

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "stopRecording" }, () => {
                console.log("📩 Sent stopRecording to content.js");
                chrome.storage.local.set({ isRecording: false });
            });
            chrome.runtime.sendMessage({ action: "stopRecording" }, (response) => {
                console.log('stopRecording response: ',response);
                startBtn.disabled = false;
                stopBtn.disabled = true;
                // if (response.status === "stopped") {
                //     startBtn.disabled = false;
                //     stopBtn.disabled = true;
                // }
            });
        });

    });
});




// document.addEventListener("DOMContentLoaded", function () {
//   const startBtn = document.getElementById("startRecording");
//   const stopBtn = document.getElementById("stopRecording");
//   const playBtn = document.getElementById("startPlayback");

//   startBtn.addEventListener("click", function () {
//       chrome.runtime.sendMessage({ action: "startRecording" });
//       startBtn.disabled = true;
//       stopBtn.disabled = false;
//       console.log("Recording started...");
//   });

//   stopBtn.addEventListener("click", function () {
//       chrome.runtime.sendMessage({ action: "stopRecording" });
//       startBtn.disabled = false;
//       stopBtn.disabled = true;
//       console.log("Recording stopped...");
//   });

//   playBtn.addEventListener("click", function () {
//       chrome.runtime.sendMessage({ action: "startPlayback" });
//   });
// });





// document.addEventListener("DOMContentLoaded", function () {
//   const startBtn = document.getElementById("startRecording");
//   const stopBtn = document.getElementById("stopRecording");
//   const playBtn = document.getElementById("startPlayback");

//   startBtn.addEventListener("click", function () {
//       chrome.runtime.sendMessage({ action: "startRecording" });
//       startBtn.disabled = true;
//       stopBtn.disabled = false;
//       console.log("Recording started...");
//   });

//   stopBtn.addEventListener("click", function () {
//       chrome.runtime.sendMessage({ action: "stopRecording" });
//       startBtn.disabled = false;
//       stopBtn.disabled = true;
//       console.log("Recording stopped...");
//   });

//   playBtn.addEventListener("click", function () {
//       chrome.runtime.sendMessage({ action: "startPlayback" });
//   });
// });







// document.addEventListener("DOMContentLoaded", function () {
//   document.getElementById("startRecording").addEventListener("click", function (e) {
//     chrome.runtime.sendMessage({ action: "startRecording" });
//     triggerContentMessage('startRecording');
//   });

//   document.getElementById("stopRecording").addEventListener("click", function (e) {
//     chrome.runtime.sendMessage({ action: "stopRecording" });
//     triggerContentMessage('stopRecording');
//   });
// });

// function triggerContentMessage (action) {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     chrome.tabs.sendMessage(tabs[0].id, { action });
//   });
// }


// document.getElementById("startRecording").addEventListener("click", () => {
//   chrome.runtime.sendMessage({ action: "startRecording" });
// });

// document.getElementById("stopRecording").addEventListener("click", () => {
//   chrome.runtime.sendMessage({ action: "stopRecording" });
// });
