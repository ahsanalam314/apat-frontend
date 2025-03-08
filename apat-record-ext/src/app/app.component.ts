import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  // imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'apat-record-ext';

  isRecording = false;
  recordedSteps: any[] = [];

  startRecording() {
    this.isRecording = true;

  }

  stopRecording() {
    this.isRecording = false;

  }

  // startRecording() {
  //   if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
  //     chrome.runtime.sendMessage({ action: "startRecording" }, response => {
  //       console.log("Message sent to background script:", response);
  //     });
  //   } else {
  //     console.error("Chrome API is not available. Make sure you're running inside a Chrome extension.");
  //   }
  // }

  // stopRecording() {
  //   chrome.runtime.sendMessage({ command: "stopRecording" });
  // }

  // sendToBackend() {
  //   chrome.runtime.sendMessage({ command: "getRecordedActions" }, (response) => {
  //     fetch("http://localhost:3000/test/execute", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(response.actions),
  //     }).then(res => res.json())
  //       .then(data => console.log("Test Execution Result:", data));
  //   });
  // }


}
