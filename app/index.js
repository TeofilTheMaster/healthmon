// to be added: CBOR file storage and cure for lazyness

import * as document from "document";
import { Accelerometer } from "accelerometer";
import { Gyroscope } from "gyroscope";
import { Barometer } from "barometer";
import { HeartRateSensor } from "heart-rate";
import { battery } from "power";
import { today } from "user-activity";
import { user } from "user-profile";
import { geolocation } from "geolocation";
import clock from "clock";
import * as fs from "fs";
import { me as device } from "device";

// Update every second
clock.granularity = "seconds";
const clockLabel = document.getElementById("time-label"); // Get 'time-label' element from the watch face

// --- Heart Rate ---
if (HeartRateSensor) {
  const hrm = new HeartRateSensor();
  hrm.addEventListener("reading", () => {
    console.log(`HR: ${hrm.heartRate}`);
  });
  hrm.start();
}

// --- Accelerometer ---
if (Accelerometer) {
  const accel = new Accelerometer({ frequency: 10 });
  accel.addEventListener("reading", () => {
    console.log(`Accel - x:${accel.x.toFixed(2)} y:${accel.y.toFixed(2)} z:${accel.z.toFixed(2)}`);
  });
  accel.start();
}

// --- Gyroscope ---
if (Gyroscope) {
  const gyro = new Gyroscope({ frequency: 10 });
  gyro.addEventListener("reading", () => {
    console.log(`Gyro - x:${gyro.x.toFixed(2)} y:${gyro.y.toFixed(2)} z:${gyro.z.toFixed(2)}`);
  });
  gyro.start();
}

// --- Barometer ---
if (Barometer) {
  const baro = new Barometer();
  baro.addEventListener("reading", () => {
    console.log(`Pressure: ${baro.pressure} Pa`);
  });
  baro.start();
}

// --- Activity Stats (Steps, Calories, etc.) ---
function logActivityData() {
  console.log(`Steps: ${today.local.steps || 0}`);
  console.log(`Calories: ${today.local.calories || 0}`);
  console.log(`Distance: ${today.local.distance || 0} m`);
  console.log(`Elevation Gain: ${today.local.elevationGain || 0}`);
}
setInterval(logActivityData, 5000); // Log every 5 seconds

// --- Battery ---
console.log(`Battery: ${battery.chargeLevel}%`);

// --- User Profile ---
console.log(`User: ${user.gender}, ${user.age} y/o, ${user.weight} kg, ${user.height} cm`);

// --- Clock (Timestamp) ---
clock.ontick = (evt) => {
  console.log(`Time: ${evt.date.toISOString()}`);
  clockLabel.text = evt.date.toTimeString().slice(0, -4);  // Update the text of the clock label with the current time
};

// --- GPS (On supported devices only) ---
geolocation.getCurrentPosition(
  (position) => {
    console.log(`GPS: Lat ${position.coords.latitude}, Lon ${position.coords.longitude}`);
  },
  (error) => {
    console.log("GPS error: " + error.message);
  },
  { timeout: 60 * 1000 }
);
