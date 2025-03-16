console.log("Content script loaded");

let recordedEvents = [];
let isRecording = false;

// Update recording state from storage
function updateRecordingState() {
    chrome.storage.local.get("isRecording", (data) => {
        isRecording = data.isRecording || false;
        console.log("📌 Recording State Updated:", isRecording);
    });
}

// Generate unique event ID
function generateEventId() {
    return "evt-" + Math.random().toString(36).substr(2, 9);
}

// Get element metadata
function getElementData(target) {
    return {
        tag: target.tagName.toLowerCase(),
        id: target.id || null,
        classList: [...target.classList],
        name: target.name || null,
        text: target.innerText || null,
        href: target.href || null,
        value: target.value || null,
        checked: target.checked || null,
        attributes: Object.fromEntries([...target.attributes].map(attr => [attr.name, attr.value])),
        xpath: getXPath(target),
        selector: getCssSelector(target),
    };
}

// Track and send event to background
function trackEvent(eventType, event, additionalData = {}) {
    chrome.storage.local.get("isRecording", (data) => {
        if (!data.isRecording) return;

        const elementData = getElementData(event.target);
        let action = {
            eventId: generateEventId(),
            eventType,
            element: elementData,
            timestamp: new Date().toISOString(),
            additionalData,
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
                y: window.scrollY,
            };
        }

        console.log("📩 Sending Event to Background:", action);
        chrome.runtime.sendMessage({ action: "recordEvent", data: action });
    });
}

// Add all event listeners
function addEventListeners() {
    console.log("🎯 Attaching event listeners...");

    document.addEventListener("click", (e) => trackEvent("click", e, { mouseButton: e.button }));
    document.addEventListener("dblclick", (e) => trackEvent("dblclick", e));
    document.addEventListener("contextmenu", (e) => trackEvent("rightclick", e));
    document.addEventListener("input", (e) => trackEvent("input", e, { value: e.target.value }));
    document.addEventListener("change", (e) => trackEvent("change", e, { checked: e.target.checked }));
    document.addEventListener("submit", (e) => trackEvent("submit", e));
    document.addEventListener("keydown", (e) => trackEvent("keydown", e, { key: e.key, keyCode: e.keyCode }));
    document.addEventListener("keyup", (e) => trackEvent("keyup", e, { key: e.key, keyCode: e.keyCode }));
    document.addEventListener("scroll", () => trackEvent("scroll", {}));
    document.addEventListener("paste", (e) => trackEvent("paste", e));
    document.addEventListener("cut", (e) => trackEvent("cut", e));
    document.addEventListener("copy", (e) => trackEvent("copy", e));
    document.addEventListener("dragstart", (e) => trackEvent("dragstart", e));
    document.addEventListener("dragend", (e) => trackEvent("dragend", e));
    document.addEventListener("drop", (e) => trackEvent("drop", e));

    console.log("✅ Event listeners added.");
}

// Utility to get XPath of an element
function getXPath(element) {
    if (element.id) return `//*[@id="${element.id}"]`;
    return (
        element.tagName.toLowerCase() +
        (element.classList.length ? `[@class="${element.classList}"]` : "")
    );
}

// Utility to get CSS selector of an element
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

// Listen for messages from background or popup
chrome.runtime.onMessage.addListener((message) => {
    console.log("Content ----> Message:", message);

    if (message.action === "startRecording") {
        chrome.storage.local.set({ isRecording: true }, () => {
            updateRecordingState();
            addEventListeners();
            console.log("🚀 Recording started!");
        });
    }
    else if (message.action === "stopRecording" && isRecording) {
        chrome.storage.local.set({ isRecording: false }, () => {
            updateRecordingState();
            console.log("🛑 Recording stopped.");
        });
    }
});

// Initial state update
updateRecordingState();

chrome.storage.onChanged.addListener((data) => {
    console.log('on changed: ', data);
})





// ----------------------------------------------------------


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
        attributes: Object.fromEntries(
            [...target.attributes].map((attr) => [attr.name, attr.value])
        ),
        xpath: getXPath(target),
        selector: getCssSelector(target),
    };
}

// Function to track events if recording is enabled
function trackEvent(eventType, event, additionalData = {}) {
    console.log("Content ----> trackEvent: ", event, "eventType: ", eventType);


    // if (!isRecording) return; // Stop if recording is disabled

    chrome.storage.local.get("isRecording", (data) => {

        console.log("Content ----> isRecording: ", data);

        const elementData = getElementData(event.target);
        let action = {
            eventId: generateEventId(),
            eventType,
            element: elementData,
            timestamp: new Date().toISOString(),
            additionalData,
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
                y: window.scrollY,
            };
        }

        console.log("📌 Event Recorded:", action);
        recordedEvents.push(action);
        chrome.runtime.sendMessage({ action: "recordEvent", data: action });
    });

}



function addEventListeners() {
    console.log("🎯 Attaching event listeners...");
    document.addEventListener("click", (event) =>
        trackEvent("click", event, { mouseButton: event.button })
    );
    document.addEventListener("dblclick", (event) =>
        trackEvent("dblclick", event)
    );
    document.addEventListener("contextmenu", (event) =>
        trackEvent("rightclick", event)
    );

    document.addEventListener("input", (event) =>
        trackEvent("input", event, { value: event.target.value })
    );
    document.addEventListener("change", (event) =>
        trackEvent("change", event, { checked: event.target.checked })
    );

    document.addEventListener("submit", (event) => trackEvent("submit", event));
    document.addEventListener("keydown", (event) =>
        trackEvent("keydown", event, { key: event.key, keyCode: event.keyCode })
    );
    document.addEventListener("keyup", (event) =>
        trackEvent("keyup", event, { key: event.key, keyCode: event.keyCode })
    );

    document.addEventListener("scroll", () => trackEvent("scroll", {}));
    document.addEventListener("paste", (event) => trackEvent("paste", event));
    document.addEventListener("cut", (event) => trackEvent("cut", event));
    document.addEventListener("copy", (event) => trackEvent("copy", event));

    document.addEventListener("dragstart", (event) =>
        trackEvent("dragstart", event)
    );
    document.addEventListener("dragend", (event) => trackEvent("dragend", event));
    document.addEventListener("drop", (event) => trackEvent("drop", event));

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
            updateRecordingState();  // Ensure the recording state updates before adding listeners
            addEventListeners();
            console.log("🚀 Recording started!");
        });
    }
    else if (message.action === "stopRecording") {
        chrome.storage.local.set({ isRecording: false }, () => {
            updateRecordingState();
            console.log("🛑 Recording stopped.");
        });
    }
});

// ✅ Initialize recording state when the content script is loaded
updateRecordingState();
