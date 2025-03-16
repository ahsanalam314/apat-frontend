let isRecording = false;
let recordedActions = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  console.log("Background ----> Message: ", message);


    if (message.action === "startRecording") {
        chrome.storage.local.set({ isRecording: true }, () => {
          recordedActions = [];
          console.log("Recording started...");
        });
    }
    else if (message.action === "stopRecording") {
        chrome.storage.local.set({ isRecording: false }, () => {
          console.log("Recording stopped...");
          sendResponse({ status: "stopped" });
          });
          return true;
    }
    else if (message.action === "recordEvent" && isRecording) {
        chrome.storage.local.get("isRecording", (data) => {
          if (data.isRecording) {
              recordedActions.push(message.data);
              console.log("Event Recorded:", message.data);
          }
        });
    }
    else if (message.action === "startPlayback") {
        console.log("▶️ Starting Playback...");
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: runPlayback,
                args: [recordedActions]
            });
        });
    }
});

function runPlayback(actions) {
    actions.forEach((action, index) => {
        setTimeout(() => {
            const element = document.querySelector(action.element.selector);
            if (element) {
                if (action.eventType === "click") {
                    element.click();
                }
                else if (action.eventType === "input") {
                    element.value = action.element.value;
                    element.dispatchEvent(new Event("input", { bubbles: true }));
                }
                else if (action.eventType === "change") {
                    element.value = action.element.value;
                    element.dispatchEvent(new Event("change", { bubbles: true }));
                }
                else if (action.eventType === "keydown") {
                    const event = new KeyboardEvent("keydown", { key: action.element.value });
                    element.dispatchEvent(event);
                }
            }
        }, index * 1000);
    });
}







// let isRecording = false;
// let recordedActions = [];

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === "startRecording") {
//         isRecording = true;
//         recordedActions = [];
//         console.log("Recording started...");
//     }
//     else if (message.action === "stopRecording") {
//         isRecording = false;
//         console.log("Recording stopped...");
//     }
//     else if (message.action === "recordEvent" && isRecording) {
//         recordedActions.push(message.data);
//         console.log("Event Recorded:", message.data);
//     }
//     else if (message.action === "startPlayback") {
//         console.log("Starting Playback...");
//         chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//             chrome.scripting.executeScript({
//                 target: { tabId: tabs[0].id },
//                 func: runPlayback,
//                 args: [recordedActions]
//             });
//         });
//     }
// });

// function runPlayback(actions) {
//     actions.forEach((action, index) => {
//         setTimeout(() => {
//             const element = document.querySelector(action.selector);
//             if (element) {
//                 if (action.type === "click") {
//                     element.click();
//                 } else if (action.type === "input") {
//                     element.value = action.value;
//                 }
//             }
//         }, index * 1000);
//     });
// }



// -------------------

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

//   console.log("Background Received message:", message); // Debugging log

//   // if (!isRecording) {
//   //   console.log('Process is stopped.....');
//   //   return;
//   // }


//   if (message.action === "startRecording" && !isRecording) {
//     isRecording = true;
//     recordedEvents = [];
//     console.log("Recording started...");
//     return;
//   }

//   if (message.action === "stopRecording") {
//     isRecording = false;
//     console.log("Recording stopped.");
//     console.log("stopRecording Events:", recordedEvents);
//     fetch("http://localhost:3000/event/save", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ events: recordedEvents })
//     })
//     .then(response => {
//       console.log('step save response: ', response.json())
//     })
//     .then(data => console.log("Server Response:", data))
//     .catch(error => console.error("Error sending data:", error));
//     recordedEvents = [];
//     return;
//   }

//   // if (message.action === "recordEvent") {
//   //   let storedEvents = JSON.parse(localStorage.getItem("recordedEvents")) || [];
//   //   storedEvents.push(...message.data);
//   //   localStorage.setItem("recordedEvents", JSON.stringify(storedEvents));
//   //   return;
//   // }

//   if (message.action === "recordEvent") {
//     chrome.storage.local.set({ recordedEvents: message.data });
//   }

//   // if (message.action === "recordEvent") {
//   //   recordedEvents.push(message.data);
//   //   console.log("recordEvent Event:", message.data);
//   //   return;
//   // }

// });




// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "recordEvent") {
//       let storedEvents = JSON.parse(localStorage.getItem("recordedEvents")) || [];
//       storedEvents.push(...message.data);
//       localStorage.setItem("recordedEvents", JSON.stringify(storedEvents));
//   }
// });
