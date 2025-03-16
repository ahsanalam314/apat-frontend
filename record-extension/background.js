let isRecording = false;
let recordedActions = [];

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Background ----> Message:", message);

    // Get the current recording state from storage
    chrome.storage.local.get("isRecording", (data) => {
        isRecording = data.isRecording || false;

        if (message.action === "startRecording") {
            isRecording = true;
            chrome.storage.local.set({ isRecording: true }, () => {
                recordedActions = [];
                console.log("🚀 Recording started...");
            });
        }

        else if (message.action === "stopRecording" && isRecording) {
            isRecording = false;
            chrome.storage.local.set({ isRecording: false }, () => {
                console.log("🛑 Recording stopped...");
                sendResponse({ status: "stopped", recordedActions }); // Respond with recorded actions if needed
            });
            return true; // Indicates async response
        }

        else if (message.action === "recordEvent" && isRecording) {
            recordedActions.push(message.data);
            console.log("📌 Event Recorded:", message.data);
        }

        else if (message.action === "getRecordedActions") {
            sendResponse({ recordedActions });
        }

        else if (message.action === "runPlayback") {
            runPlayback(message.actions);
            sendResponse({ status: "playback started" });
        }
    });

    return true; // Ensures sendResponse works asynchronously
});

// Function to playback recorded actions
function runPlayback(actions) {
    console.log("▶️ Starting playback of actions:", actions);
    actions.forEach((action, index) => {
        setTimeout(() => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        func: executeAction,
                        args: [action]
                    });
                }
            });
        }, index * 1000); // Delay between actions
    });
}

// This function runs in the context of the webpage
function executeAction(action) {
    const element = document.querySelector(action.element.selector);
    if (!element) {
        console.warn("⚠️ Element not found:", action.element.selector);
        return;
    }

    if (action.eventType === "click") {
        element.click();
    } else if (action.eventType === "input" || action.eventType === "change") {
        element.value = action.element.value;
        element.dispatchEvent(new Event(action.eventType, { bubbles: true }));
    } else if (action.eventType === "keydown") {
        const event = new KeyboardEvent("keydown", { key: action.key });
        element.dispatchEvent(event);
    }
}






// -------------------------
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

//     console.log("Background ----> Message: ", message);

//     chrome.storage.local.get("isRecording", (data) => {
//         isRecording = data.isRecording || false;

//         if (message.action === "startRecording") {
//             isRecording = true;
//             chrome.storage.local.set({ isRecording: true }, () => {
//                 recordedActions = [];
//                 console.log("🚀 Recording started...");
//             });
//         }
//         else if (message.action === "stopRecording") {
//             isRecording = false;
//             chrome.storage.local.set({ isRecording: false }, () => {
//                 console.log("🛑 Recording stopped...");
//                 sendResponse({ status: "stopped" });
//             });
//             return true;
//         }
//         else if (message.action === "recordEvent" && isRecording) {
//             recordedActions.push(message.data);
//             console.log("📌 Event Recorded:", message.data);
//         }
//     });
// });

// function runPlayback(actions) {
//     actions.forEach((action, index) => {
//         setTimeout(() => {
//             let element = document.querySelector(action.element.selector);
//             if (!element) {
//                 console.warn("⏳ Waiting for element to appear...", action.element.selector);
//                 let interval = setInterval(() => {
//                     element = document.querySelector(action.element.selector);
//                     if (element) {
//                         clearInterval(interval);
//                         executeEvent(element, action);
//                     }
//                 }, 500);
//                 return;
//             }
//             executeEvent(element, action);
//         }, index * 1000);
//     });
// }

// function executeEvent(element, action) {
//     if (!element) return;
//     if (action.eventType === "click") {
//         element.click();
//     } 
//     else if (action.eventType === "input") {
//         element.value = action.element.value;
//         element.dispatchEvent(new Event("input", { bubbles: true }));
//     } 
//     else if (action.eventType === "change") {
//         element.value = action.element.value;
//         element.dispatchEvent(new Event("change", { bubbles: true }));
//     } 
//     else if (action.eventType === "keydown") {
//         const event = new KeyboardEvent("keydown", { key: action.key });
//         element.dispatchEvent(event);
//     }
// }


