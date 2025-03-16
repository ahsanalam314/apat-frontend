console.log('Content script loaded');

let recordedEvents = [];

// Check recording state when content script loads
// chrome.storage.local.get("isRecording", (data) => {
//   if (data.isRecording) {
//       console.log("Recording is already enabled.");
//   }
// });

function updateRecordingState() {
  chrome.storage.local.get("isRecording", (data) => {
      isRecording = data.isRecording || false;
      console.log("📌 Recording State Updated:", isRecording);
  });
}


function generateEventId() {
    return "evt-" + Math.random().toString(36).substr(2, 9);
}

// Function to extract element data
function getElementData(target) {
  return {
      tag: target.tagName.toLowerCase(),
      id: target.id || null,
      classList: [...target.classList] || [],
      name: target.name || null,
      text: target.innerText || null,
      href: target.href || null,
      value: target.value || null,
      checked: target.checked || null,
      attributes: Object.fromEntries([...target.attributes].map(attr => [attr.name, attr.value])),
      xpath: getXPath(target),
      selector: getCssSelector(target)
  };
}


// Function to track events if recording is enabled
function trackEvent(eventType, event, additionalData = {}) {

  console.log("Content ----> trackEvent: ", event, 'eventType: ', eventType);

  console.log("Content ----> isRecording: ", isRecording);

  if (!isRecording) return; // Stop if recording is disabled

  const elementData = getElementData(event.target);
  let action = {
      eventId: generateEventId(),
      eventType,
      element: elementData,
      timestamp: new Date().toISOString(),
      additionalData
  };

  if (eventType === "keydown") {
      action.key = event.key;
      action.code = event.code;
      action.ctrlKey = event.ctrlKey;
      action.shiftKey = event.shiftKey;
      action.altKey = event.altKey;
  }

  if (eventType === "scroll") {
      action.scrollPosition = {
          x: window.scrollX,
          y: window.scrollY
      };
  }

  console.log("📌 Event Recorded:", action);
  recordedEvents.push(action);
  chrome.runtime.sendMessage({ action: "recordEvent", data: action });
}

function addEventListeners() {
  console.log("🎯 Attaching event listeners...");
  document.addEventListener("click", event => trackEvent("click", event, { mouseButton: event.button }));
  document.addEventListener("dblclick", event => trackEvent("dblclick", event));
  document.addEventListener("contextmenu", event => trackEvent("rightclick", event));

  document.addEventListener("input", event => trackEvent("input", event, { value: event.target.value }));
  document.addEventListener("change", event => trackEvent("change", event, { checked: event.target.checked }));

  document.addEventListener("submit", event => trackEvent("submit", event));
  document.addEventListener("keydown", event => trackEvent("keydown", event, { key: event.key, keyCode: event.keyCode }));
  document.addEventListener("keyup", event => trackEvent("keyup", event, { key: event.key, keyCode: event.keyCode }));

  document.addEventListener("scroll", () => trackEvent("scroll", {}));
  document.addEventListener("paste", event => trackEvent("paste", event));
  document.addEventListener("cut", event => trackEvent("cut", event));
  document.addEventListener("copy", event => trackEvent("copy", event));

  document.addEventListener("dragstart", event => trackEvent("dragstart", event));
  document.addEventListener("dragend", event => trackEvent("dragend", event));
  document.addEventListener("drop", event => trackEvent("drop", event));

  console.log("Event listeners added.");
}

// ✅ Utility: Get XPath of an element
function getXPath(element) {
  if (element.id) return `//*[@id="${element.id}"]`;
  return (
      element.tagName.toLowerCase() +
      (element.classList.length ? `[@class="${element.classList}"]` : "")
  );
}

// ✅ Utility: Get CSS Selector of an element
function getCssSelector(element) {
  let path = [];
  while (element.parentElement) {
      let selector = element.tagName.toLowerCase();
      if (element.id) {
          selector += `#${element.id}`;
          path.unshift(selector);
          break;
      } else if (element.classList.length) {
          selector += `.${element.classList.value.replace(/\s+/g, ".")}`;
      }
      path.unshift(selector);
      element = element.parentElement;
  }
  return path.join(" > ");
}

// ✅ Start tracking when extension recording starts
chrome.runtime.onMessage.addListener((message) => {

  console.log("Content ----> Message: ", message);


  if (message.action === "startRecording") {
      chrome.storage.local.set({ isRecording: true }, () => {
          console.log("🚀 Recording started!");
          updateRecordingState();
          addEventListeners();
      });
  } else if (message.action === "stopRecording") {
      chrome.storage.local.set({ isRecording: false }, () => {
          console.log("🛑 Recording stopped.");
          updateRecordingState();
      });
  }
});

// ✅ Initialize recording state when the content script is loaded
updateRecordingState();
