//https://github.com/aws/aws-iot-device-sdk-js#device
import { device } from "aws-iot-device-sdk";

export class Device {
  public device: device;
  public deviceID: string;
  public isActive: boolean;
  public cityID: string;
  public triggerNumber: number;
  public shadowName: string;

  constructor(data: {
    deviceID: string;
    shadowName: string;
    cityID: string;
    rowPrivateKey: any;
    rowClientCert: any;
    rowCaCert: any;
    clientId: string;
    endpoint: string;
  }) {
    this.deviceID = data.deviceID;
    this.isActive = false;
    this.cityID = data.cityID;
    this.shadowName = data.shadowName;
    this.triggerNumber = 0;

    const privateKey = Buffer.from(data.rowPrivateKey, "base64");
    const clientCert = Buffer.from(data.rowClientCert, "base64");
    const caCert = Buffer.from(data.rowCaCert, "base64");

    this.device = new device({
      privateKey: privateKey,
      clientCert: clientCert,
      caCert: caCert,
      clientId: data.clientId,
      host: data.endpoint,
    });
  }

  public connect() {
    this.device.on("connect", () => {
      console.log(this.shadowName + " connected to AWS IoT");

      // Subscribe to specfic topic
      this.device.subscribe(
        "$aws/things/" + this.shadowName + "/shadow/update/accepted"
      );
    });

    //Wait for messages on the subscribed topic
    this.device.on("message", (topic: any, message: any) => {
      //Message parsing to json
      message = JSON.parse(message.toString());
      //If it is a message of still alive change his state
      if (message?.state?.reported?.value === "stillAlive") {
        this.isActive = true;
      }
      //if it is a trigger signal  increase the counter
      else if (message?.state?.reported?.value === "triggered") {
        this.triggerNumber = this.triggerNumber + 1;
      }
    });
  }

  public disconnect() {
    //Close the connection
    this.device.end();
  }
}
