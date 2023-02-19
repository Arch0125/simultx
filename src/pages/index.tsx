import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSendTransaction, usePrepareSendTransaction, useSigner, useProvider } from "wagmi";
import { onTransaction } from "@/snap/src";
import Notifications from "@/utils/Notifications";
import GetAccount from "@/utils/GetAccount";
import TransferERC from "@/utils/TransferERC";
import { useState } from "react";
import * as PushAPI from "@pushprotocol/restapi";
import { ethers } from "ethers";


const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  const abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "subtractedValue",
                "type": "uint256"
            }
        ],
        "name": "decreaseAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "addedValue",
                "type": "uint256"
            }
        ],
        "name": "increaseAllowance",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]


  const defaultSnapOrigin = `local:http://localhost:3000`;
  const[receiver,setReceiver]=useState<string>("");
  const[amount,setAmount]=useState<string>("");
  const[ethbal,setEthbal]=useState<string>("");
  const[wethbal,setWethbal]=useState<string>("");
  
  const addr = GetAccount();
  const{data:signer}=useSigner();
  const provider = useProvider();

  const tx = {
    to:"0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
    from : "0x28a292f4dc182492f7e23cfda4354bff688f6ea8",
    value: ethers.utils.parseEther("0.1"),
    data:"0xd0e30db0"
  }

  const sendtx =async () => {
    try{
      await signer?.sendTransaction(tx);
    }catch(e){
      console.log(e);
    }
  }

  const weth = new ethers.Contract("0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",abi,provider);

  const getbalance = async () => {
    const wethbal = await weth.balanceOf(addr);
    const ethbal = await provider?.getBalance(addr);
    setEthbal(ethers.utils.formatEther(ethbal));
    setWethbal(ethers.utils.formatEther(wethbal));
  }

  getbalance();

  const pushoptin = async () => {
    await PushAPI.channels.subscribe({
      signer: signer,
      channelAddress: 'eip155:5:0x118aeFa610ceb7C42C73d83dfC3D8C54124A4946', // channel address in CAIP
      userAddress: `eip155:5:${addr}`, // user address in CAIP
      onSuccess: () => {
       console.log('opt in success');
      },
      onError: () => {
        console.error('opt in error');
      },
      env: 'staging'
    })
  }

  const erctransfer = async () => {
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
        addr?.toString() || '0x0000000'
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
        const receipt =await TransferERC(receiver,amount,signer,provider);
        console.log(receipt);
      }
    }
  };

  const uniswaptx = async () => {
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
        addr?.toString() || '0x0000000'
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
        sendtx();
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
      <div className="flex flex-col h-screen w-screen">
        <div className="flex flex-row justify-between items-center h-fit p-5 w-full border-b-2 border-white">
          <p className="text-3xl font-bold">Safe <span className="text-violet-600">Snap</span></p>
        <ConnectButton />
        </div>
        <div className="grid grid-cols-3 gap-7 m-7 ">
          <div className="flex flex-col h-fit p-3 border-[1px] border-white rounded-xl" >
            <p className="text-3xl mb-2 font-bold">Connect </p>
            <hr className="pb-4" />
            <p className={styles.description}>Get started by connecting installing snap in your metamask</p>
            <button onClick={() => connectSnap()} className="bg-white text-black px-4 py-2 rounded-xl font-medium mt-3" >🦊 Connect Snap</button>
          </div>
          <div className="flex flex-col h-fit p-3 border-[1px] border-white rounded-xl" >
            <p className="text-3xl mb-2 font-bold">Notifications </p>
            <hr className="pb-4" />
            <p className={styles.description}>Opt in PUSH Channel for getting onchain OTP for extra layer of security</p>
            <button onClick={() => pushoptin()} className="bg-white text-black px-4 py-2 rounded-xl font-medium mt-3" >🔔 Opt In</button>
          </div>
          <div className="flex flex-col h-fit p-3 border-[1px] border-white rounded-xl" >
            <p className="text-3xl mb-2 font-bold">Send Transaction </p>
            <hr className="pb-4" />
            <input onChange={(e)=>setReceiver(e.target.value)} type="text" className="border-[1px] border-white rounded-xl px-3 py-2 w-full mb-3" placeholder="Enter Address" />
            <input onChange={(e)=>setAmount(e.target.value)} type="text" className="border-[1px] border-white rounded-xl px-3 py-2 w-full mb-3" placeholder="Enter Amount" />
            <button onClick={() => erctransfer()} className="bg-white text-black px-4 py-2 rounded-xl font-medium mt-3" >💸 Send</button>
          </div>
          <div className="flex flex-col h-fit p-3 border-[1px] border-white rounded-xl" >
            <p className="text-3xl mb-2 font-bold">🦄 Uniswap Widget</p>
            <hr className="pb-4" />
            <p className={styles.description}>This widget swaps 0.1 ETH for 0.1 WETH on Goerli using OTP for verification</p>
            <br/>
            <p className={styles.description}>ETH Balance : {ethbal}</p>
            <p className={styles.description}>WETH Balance : {wethbal}</p>
            <button onClick={() => uniswaptx()} className="bg-white text-black px-4 py-2 rounded-xl font-medium mt-3" >🔁 Swap</button>
          </div>
        </div>
      </div>
    </>
  );
}
