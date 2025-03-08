console.log("Content script loaded!");

let isRecording = false;

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message) => {
  console.log('content message: ', message)
    if (message.action === "startRecording") {
        isRecording = true;
    }
    if (message.action === "stopRecording") {
        isRecording = false;
    }
});

document.addEventListener("click", function (event) {

  if (!isRecording) return; // Stop event logging if recording is off


    let element = event.target;

    let actionData = {
        type: "click",
        tagName: element.tagName,
        innerText: element.innerText,
        xpath: getXPath(element)
    };

    console.log("Captured Action:", actionData);

    try {
      chrome.runtime.sendMessage({ action: "recordEvent", data: actionData });
    } catch (error) {
        console.warn("Failed to send message. Extension might be reloaded or inactive.", error);
    }
});

// Function to generate XPath of an element
function getXPath(element) {
    if (element.id !== "") return `//*[@id="${element.id}"]`;
    if (element === document.body) return "/html/body";

    let ix = 0;
    let siblings = element.parentNode.childNodes;
    for (let i = 0; i < siblings.length; i++) {
        let sibling = siblings[i];
        if (sibling === element) return getXPath(element.parentNode) + "/" + element.tagName.toLowerCase() + "[" + (ix + 1) + "]";
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName) ix++;
    }
}
