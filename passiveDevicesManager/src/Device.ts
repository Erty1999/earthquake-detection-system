//https://github.com/aws/aws-iot-device-sdk-js#device
import { device } from "aws-iot-device-sdk";

export class Device {
  public device: device;
  public deviceID: string;
  public isActive: boolean;
  public cityID: string;
  public triggerNumber: number;
  public shadowName: string;
  public status: string;

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
    this.status = "No Data";

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

      // Publish a message
      this.device.publish(
        "$aws/things/" + this.shadowName + "/shadow/update", this.status
      );
    });
  }

  public updateStatus(status: string) {
    //If there's a status change
    if (status != this.status) {
      this.status = status;
      // Publish a message
      this.device.publish(
        "$aws/things/" + this.shadowName + "/shadow/update",
        this.status
      );
    }
  }

  public disconnect() {
    //Close the connection
    this.device.end();
  }
}
