const fs = require("fs");
const awsIot = require("aws-iot-device-sdk");

function recoverData() {
  const device = awsIot.device({
    keyPath:
      "./cagliari1/d56a1120b5a778a5b607baacf4ecc6b57747f660fee5b5248b0e0c5958c088d9-private.pem.key",

    certPath:
      "./cagliari1/d56a1120b5a778a5b607baacf4ecc6b57747f660fee5b5248b0e0c5958c088d9-certificate.pem.crt",

    caPath: "./cagliari1/AmazonRootCA1.pem",
    clientId: "yourClientId",
    host: "a3b65ekevtnf85-ats.iot.eu-central-1.amazonaws.com",
  });

  device.on("connect", function () {
    console.log("Connected to AWS IoT");

    // Subscribe to a topic
    device.subscribe("$aws/things/cagliari1/shadow/update/accepted");

    // Publish a message
    device.publish("your/topic", "Hello from AWS IoT");
  });

  // Handle incoming messages
  device.on("message", function (topic, message) {
    console.log("Received message:", message.toString());
  });
}

recoverData();
