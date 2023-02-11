import { OnTransactionHandler } from "@metamask/snap-types";

async function getgasfees(){
  const response = await fetch('https://beaconcha.in/api/v1/execution/gasnow');
  return response.text();
}

async function simul(from:string, to:string, value:string, data:string){
  const options = {
    method: 'POST',
    headers: {accept: 'application/json', 'content-type': 'application/json'},
    body: JSON.stringify({
      "id": 1,
      "jsonrpc": "2.0",
      "method": "alchemy_simulateAssetChanges",
      "params": [
           {
                "from": `${from}`,
                "to": `${to}`,
                "value": `${value}`,
                "data": `${data}`
           }
      ]
 }
 )
  };
  
  const res = await fetch('https://eth-goerli.g.alchemy.com/v2/gh4d1-dAT4B_1Khy86s7JUbFhQIclYqO', options)
  return res.text();
}

export const onTransaction : OnTransactionHandler = async({ transaction,chainId }) => {

  const{from, to, value, data} = transaction;
  return simul(from,to,value,data).then((txdetails) => {
    const res = JSON.parse(txdetails);
    return {
      insights:{
        transaction,
        chainId,
        message:`${res}`,
      }
    }
  });

 
};
