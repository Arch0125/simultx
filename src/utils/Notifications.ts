import * as React from 'react';
import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";

const Notifications = async(title : string, body: string, receiver:string) => {



    const PK = "a9cc28af8e75ea5521ab0290604f056f1729d80acd3f326d8b90dad59b37020c"
    const Pkey = `0x${PK}`;
    const signer = new ethers.Wallet(Pkey);
    const apiResponse = await PushAPI.payloads.sendNotification({
      signer,
      type: 3, // target
      identityType: 2, // direct payload
      notification: {
        title: title,
        body: body,
      },
      payload: {
        title: title,
        body: body,
        cta: '',
        img: ''
      },
      recipients: `eip155:5:${receiver}`, // recipient address
      channel: 'eip155:5:0x118aeFa610ceb7C42C73d83dfC3D8C54124A4946', // your channel address
      env: 'staging'
    });
  return true;
};

export default Notifications;
