document.addEventListener("DOMContentLoaded", function () {
  const playBtn = document.querySelector("#startPlayback");

  if (playBtn) {
      playBtn.addEventListener("click", function () {
          chrome.runtime.sendMessage({ action: "startPlayback" });
      });
  } else {
      console.warn("⚠️ Playback button not found!");
  }
});




// document.addEventListener("DOMContentLoaded", function () {
//   const startButton = document.querySelector("#startPlayback"); // Example button

//   if (startButton) {
//       startButton.addEventListener("click", function () {
//           console.log("Playback started...");
//           startTestPlayback(); // Your function to replay recorded actions
//       });
//   } else {
//       console.warn("Start button not found. Ensure the element exists.");
//   }
// });

// // Example function to replay actions
// function startTestPlayback() {
//   chrome.runtime.sendMessage({ action: "startPlayback" }, (response) => {
//       console.log("Playback response:", response);
//   });
// }



// function replayActions() {
//   chrome.storage.local.get("recordedEvents", (data) => {
//       const actions = data.recordedEvents || [];

//       actions.forEach(action => {
//           let element = document.querySelector(action.element.selector);
//           if (!element) return;

//           switch (action.eventType) {
//               case "click":
//                   element.click();
//                   break;
//               case "input":
//                   element.value = action.element.value;
//                   element.dispatchEvent(new Event("input", { bubbles: true }));
//                   break;
//               case "change":
//                   element.checked = action.element.checked;
//                   element.dispatchEvent(new Event("change", { bubbles: true }));
//                   break;
//               case "submit":
//                   element.closest("form").submit();
//                   break;
//           }
//       });
//   });
// }

// document.getElementById("replayActions").addEventListener("click", replayActions);




// function replayActions(actions) {
//   actions.forEach(action => {
//       let element = document.querySelector(action.element.selector);
//       if (!element) return;

//       switch (action.eventType) {
//           case "click":
//               element.click();
//               break;
//           case "input":
//               element.value = action.element.value;
//               element.dispatchEvent(new Event("input", { bubbles: true }));
//               break;
//           case "change":
//               element.checked = action.element.checked;
//               element.dispatchEvent(new Event("change", { bubbles: true }));
//               break;
//           case "submit":
//               element.closest("form").submit();
//               break;
//       }
//   });
// }

// // Fetch events from storage and replay them
// const storedEvents = JSON.parse(localStorage.getItem("recordedEvents")) || [];
// replayActions(storedEvents);

