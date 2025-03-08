document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("startRecording").addEventListener("click", function (e) {
    console.log('e: ', e);
    chrome.runtime.sendMessage({ action: "startRecording" });
    triggerContentMessage('startRecording');
  });

  document.getElementById("stopRecording").addEventListener("click", function (e) {
    console.log('e: ', e);

    chrome.runtime.sendMessage({ action: "stopRecording" });
    triggerContentMessage('stopRecording');
  });
});

function triggerContentMessage (action) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action });
  });
}
