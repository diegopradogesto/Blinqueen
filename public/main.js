'use strict';

// Initializes the SmartHome.
function SmartHome() {
  document.addEventListener('DOMContentLoaded', function () {
    // Shortcuts to DOM Elements.
    this.denyButton = document.getElementById('demo-deny-button');
    this.userWelcome = document.getElementById('user-welcome');

    // Bind events.
    this.updateButton = document.getElementById('demo-light-update');
    this.updateButton.addEventListener('click', this.updateState.bind(this));
    this.light = document.getElementById('demo-light');
    this.requestSync = document.getElementById('request-sync');
    this.requestSync.addEventListener('click', async () => {
      try {
        const response = await fetch('/requestsync');
        console.log(response.status == 200 ?
          'Request SYNC success!' : `Request SYNC unexpected status: ${response.status}`);
      } catch (err) {
        console.error('Request SYNC error', err);
      }
    });

    this.initFirebase();
    this.initLight();
  }.bind(this));
}

SmartHome.prototype.initFirebase = () => {
  // Initiates Firebase.
  console.log("Initialized Firebase");
};

SmartHome.prototype.initLight = () => {
  console.log("Logged in as default user");
  this.uid = "123";
  this.smarthome.userWelcome.innerHTML = "Welcome user 123!";

  this.smarthome.handleData();
  this.smarthome.light.style.display = "block";
}

SmartHome.prototype.setToken = (token) => {
  document.cookie = '__session=' + token + ';max-age=3600';
};

SmartHome.prototype.handleData = () => {
  const uid = this.uid;
  const elOnOff = document.getElementById('demo-light-onOff');
  const elBrightness = document.getElementById('demo-light-brightness');

  firebase.database().ref('/').child('light').on("value", (snapshot) => {
    if (snapshot.exists()) {
      const lightState = snapshot.val();
      console.log(lightState)

      if (lightState.OnOff.on) elOnOff.MaterialSwitch.on();
      else elOnOff.MaterialSwitch.off();

      if (lightState.Brightness.brightness > 50) elBrightness.MaterialSwitch.on();
      else elBrightness.MaterialSwitch.off();
    }
  })
}

SmartHome.prototype.updateState = () => {
  const elOnOff = document.getElementById('demo-light-onOff');
  const elBrightness = document.getElementById('demo-light-brightness');

  const pkg = {
    OnOff: { on: elOnOff.classList.contains('is-checked') },
    Brightness: { brightness: 100 * elBrightness.classList.contains('is-checked') }
  };


  console.log(pkg);
  firebase.database().ref('/').child('light').set(pkg);
}

// Load the SmartHome.
window.smarthome = new SmartHome();
