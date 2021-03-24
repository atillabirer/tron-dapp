import { Box, Link } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { JUST_SWAP_FACTORY, TEW_TOKEN, JUST_SWAP_EXCHANGE_TRX_TEW, getTronWeb } from "../web/util.js";
import theme from "../../../assets/theme/index.js";
import DefaultInput from "../../../components/Input/Default/index.js";
import ProvideContainer from "./provide.js";

const ProvidedLiquidityContainer = ({ onAddLiquidity, onAlert }) => {
  const [lpBalance, setLPBalance] = useState(0);

  const [trxBalance, setTrxBalance] = useState(0);
  const [publicAddress, setPublicAddress] = useState("");
  let curWeb = getTronWeb();
  const getTotalSupplyOfPoolToken = async () => {
    var functionSelector = "totalSupply()";

    var parameter = [
    ];

    let transaction = await curWeb.transactionBuilder.triggerConstantContract(
      JUST_SWAP_EXCHANGE_TRX_TEW,
      functionSelector,
      {},
      parameter
    );
    let LP = curWeb.BigNumber("0x" + transaction["constant_result"][0]);
    //setLPBalance(LP.toNumber() / Math.pow(10, 6));
    console.log(LP);
  }
  const initBalance = async () => {
    //console.log("INIT",curWeb);
    if (curWeb) {
      let curAddr = curWeb.defaultAddress.base58;
      setPublicAddress(curAddr);
      let trxBalanceOfOwner = await curWeb.trx.getBalance(curAddr);
      let trxBalanceOfPool = await curWeb.trx.getBalance(JUST_SWAP_EXCHANGE_TRX_TEW);
      setTrxBalance(trxBalanceOfOwner);
      if (true) {
        let contract = await curWeb.contract().at(TEW_TOKEN);
        let tewBalanceOfOwner = await contract.balanceOf(curAddr).call();
        let tewBalanceOfPool = await contract.balanceOf(JUST_SWAP_EXCHANGE_TRX_TEW).call();
        //curWeb.bignumer

        var functionSelector = "balanceOf(address)";

        var parameter = [
          {
            type: "address",
            value: curAddr,
          }
        ];

        let transaction = await curWeb.transactionBuilder.triggerConstantContract(
          JUST_SWAP_EXCHANGE_TRX_TEW,
          functionSelector,
          {},
          parameter
        );
        let LP = curWeb.BigNumber("0x" + transaction["constant_result"][0]);
        setLPBalance(LP.toNumber() / Math.pow(10, 6));
        getTotalSupplyOfPoolToken();
      }
    }
  };

  useEffect(() => {
    var interval = setInterval(initBalance, 1000)
    return () => clearInterval(interval)
  }, []);

  const removeLiquidity = async (lpBalance) => {
    let functionSelector = "removeLiquidity(uint256,uint256,uint256,uint256)";
    let parameter = [
      {
        type: "uint256",
        value: Math.round(lpBalance)
      },
      {
        type: "uint256",
        value: 1
      },
      {
        type: "uint256",
        value: 1
      },
      {
        type: "uint256",
        value: Math.round(Date.now() / 1000) + 600
      }
    ];
    console.log(parameter)
    let transaction = await curWeb.transactionBuilder.triggerSmartContract(

      JUST_SWAP_EXCHANGE_TRX_TEW,
      functionSelector,
      { feeLimit: 40000000 },
      parameter
    );

    const signedTransaction = await curWeb.trx.sign(transaction.transaction);
    if (!signedTransaction.signature) {
      return console.error('Transaction was not signed properly');
    }
    const broadcast = await curWeb.trx.sendRawTransaction(signedTransaction);
    if (broadcast.txid) {
      onAlert("Liquidity removed!: " + broadcast.txid)
      setLPBalance(0)

    }
  }


  return (
    <Box className="pool-wd-one">
      <Box className="pool-wrp pool-wrp1">
        <Box className="titlebar">
          <h3>Provided Liquidity</h3>
        </Box>
        <Box className="pool-dt">
          <h3>Liquidity</h3>
          <p>Add liquidity to receive LP Tokens</p>
        </Box>
        <Box className="main-btn">
          <Link href="#" className="pool-wrp1-btn" onClick={e => { onAddLiquidity() }}>
            Add Liquidity
          </Link>
        </Box>
       
       <ProvideContainer lpBalance={lpBalance}/>
        <Box className="Textfield-wrp  table-wrp">

          <Box className="LPT-wrp">
            <h6>Your Liquidity:</h6>
            <h3>

              {lpBalance} <span style={{opacity:100}}>LPT</span>
            </h3>
            <Box className="main-btn">
              <Link
                href="#"
                className="pool-wrp2-btn"
                onClick={() => removeLiquidity(lpBalance * 1000000)}
              >
                Remove Liquidity
        </Link>
            </Box>
          </Box>
          <Box className="clear"></Box>

        </Box>
        <Box className="tbs-fot">

        </Box>
      </Box>
    </Box>
  );
};

export default ProvidedLiquidityContainer;