import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSendTransaction, usePrepareSendTransaction } from "wagmi";
import { onTransaction } from "@/snap/src";
import Notifications from "@/utils/Notifications";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const defaultSnapOrigin = `local:http://localhost:3000`;
  const { config } = usePrepareSendTransaction({
    request: { to: "0xC5Db59D48700B6bC8D53cE773b21931d986DEa0E", value: "10" },
  });
  const { data, isLoading, isSuccess, sendTransaction } =
    useSendTransaction(config);

  const sendHello = async () => {
    const res1 = await window.ethereum.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: defaultSnapOrigin,
        request: { method: "confirmTransaction" },
      },
    });
    if (res1?.res == true) {
      const number = Math.floor(Math.random() * (999 - 100 + 1) + 100);
      const notifres = await Notifications(
        `A Transaction request has been made from ${res1?.origin}`,
        `The OTP for Transaction approval is ${number}`,
      )
      const res2 = await window.ethereum.request({
        method: "wallet_invokeSnap",
        params: {
          snapId: defaultSnapOrigin,
          request: { method: "requestOtp" },
        },
      });
      if (Number(res2) !== number) {
        const res3 = await window.ethereum.request({
          method: "wallet_invokeSnap",
          params: {
            snapId: defaultSnapOrigin,
            request: { method: "wrongOtp" },
          },
        });
      }else{
        alert("Transaction Successful");
      }
    }
  };

  const connectSnap = async (
    snapId: string = defaultSnapOrigin,
    params: Record<"version" | string, unknown> = {}
  ) => {
    await window.ethereum?.request({
      method: "wallet_requestSnaps",
      params: {
        [snapId]: params,
      },
    });
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <ConnectButton />
        <button onClick={() => connectSnap()}>Connect Snap</button>
        <button onClick={() => sendHello()}>Send Hello</button>
        <button onClick={() => signTx()}>Send Transaction</button>
      </div>
    </>
  );
}
