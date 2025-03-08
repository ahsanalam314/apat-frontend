let steps = [];
let recordedEvents = [];

let isRecording = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  console.log("Background Received message:", message); // Debugging log

  // if (!isRecording) {
  //   console.log('Process is stopped.....');
  //   return;
  // }


  if (message.action === "startRecording" && !isRecording) {
    isRecording = true;
    recordedEvents = [];
    console.log("Recording started...");
    return;
  }

  if (message.action === "stopRecording") {
    isRecording = false;
    console.log("Recording stopped.");
    console.log("stopRecording Events:", recordedEvents);
    recordedEvents = [];
    return;
  }

  if (message.action === "recordEvent") {
    recordedEvents.push(message.data);
    console.log("recordEvent Event:", message.data);
    return;
  }

  if (message.action === "updateSteps") {
      steps = message.steps;
      console.log("Updated Steps:", steps);
      return;
  }

  if (message.action === "getSteps") {
      sendResponse({ steps });
      return;
  }
});
