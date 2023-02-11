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
  
  const res = await fetch('https://polygon-mumbai.g.alchemy.com/v2/vHwfpZ6rtiUnZ1cRnhf1TDCPkXPrypOv', options)
  return res;
}

async function generateResult(tokens: any){
  let result = ``
  tokens = JSON.parse(tokens);
  tokens.forEach((token: any) => {
    result += `\n${Number(token.amount).toFixed(2)} ${token.symbol} ${token.changeType} from ${token.from.toString().slice(0,5)} to ${token.to.toString().slice(0,5)}\n`;
  });
  return result;
}

export const onTransaction : OnTransactionHandler = async({ transaction,chainId }) => {

  const{from, to, value, data} = transaction;
  return simul(from,to,value,data).then(async (txdetails) => {
    const res = await txdetails.json();
    const tokens = JSON.stringify(res.result.changes);
    const error = JSON.stringify(res.result.error);

    
    if(error === "null"){
      let tokenchange = await generateResult(tokens);
      return {
        insights:{
          message: `${tokenchange}`,
        }
      }
    }else{
      return {
        insights:{
          message: 
            `${error} : API Limit reached, please try again later`,
        }
      }
    }  
  });
};
