const awsIot = require("aws-iot-device-sdk");

function recoverData() {
  import * as awsIot from "aws-iot-device-sdk";
import { Buffer } from "buffer";
router.get("/test", async (req, res, next) => {
  let error = false;

  const iotRepository = AppDataSource.getRepository(iotThing);

  const iotList = await iotRepository
    .find({ relations: ["shadowPrivateKey", "shadowCertificate", "shadowCA"] })
    .catch((e) => {
      error = true;
    });

  if (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  const privateKey = Buffer.from(
    iotList?.at(0)?.shadowPrivateKey.data as any,
    "base64"
  )
  const clientCert = Buffer.from(
    iotList?.at(0)?.shadowCertificate.data as any,
    "base64"
  )
  const caCert = Buffer.from(
    iotList?.at(0)?.shadowCA.data as any,
    "base64"
  )

  const device = new awsIot.device({
    privateKey: privateKey,
    clientCert: clientCert,
    caCert: caCert,
    clientId: iotList?.at(0)?.shadowClientID,
    host: "a3b65ekevtnf85-ats.iot.eu-central-1.amazonaws.com"//iotList?.at(0)?.shadowEndpoint,
  });

  device.on("connect", function () {
    console.log("Connected to AWS IoT");

    // Subscribe to a topic
    device.subscribe("$aws/things/cagliari1/shadow/update/accepted");

    // Publish a message
    device.publish("your/topic", "Hello from AWS IoT");
  });

  // Handle incoming messages
  device.on("message", function (topic: any, message: any) {
    console.log("Received message:", message.toString());
  });
  //res.send(true);
});
}

recoverData();
