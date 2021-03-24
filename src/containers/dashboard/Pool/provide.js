import { Box, Link } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { USDT_TOKEN, JUST_SWAP_EXCHANGE_USDT_TRX, TEW_TOKEN, JUST_SWAP_EXCHANGE_TRX_TEW, getTronWeb } from "../web/util.js";
import { PieChart } from "react-minimal-pie-chart";


const ProvideContainer = () => {
  let curWeb = getTronWeb();
  const [publicAddress, setPublicAddress] = useState("");
  const [trxBalance, setTrxBalance] = useState(0);
  const [tewBalance, setTewBalance] = useState(0);
  const [dollar, setDollar] = useState(0);
  const [fees, setFees] = useState(0);
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    initBalance();
  }, [curWeb]);
  const getFees = () => {
    if (fees === 0) return "Calculating...";

  }
  const getUsdPerTrx = async () => {

    let balance = await curWeb.trx.getBalance(JUST_SWAP_EXCHANGE_USDT_TRX);

    var functionSelector = "balanceOf(address)";

    var parameter = [
      {
        type: "address",
        value: JUST_SWAP_EXCHANGE_USDT_TRX //curWeb.defaultAddress.base58,
      }
    ];

    let transaction = await curWeb.transactionBuilder.triggerConstantContract(
      USDT_TOKEN,
      functionSelector,
      {},
      parameter
    );

    let LP = curWeb.BigNumber("0x" + transaction["constant_result"][0]);
    return LP.dividedBy(balance).toNumber();
  }

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
    return LP;
  }

  const getBalanceOfPoolToken = async () => {
    var functionSelector = "balanceOf(address)";

    var parameter = [
      {
        type: "address",
        value: curWeb.defaultAddress.base58,//'TR6UrvpQFs43vSW8n3HkRqW4BoeikRqU6K' //
      }
    ];

    let transaction = await curWeb.transactionBuilder.triggerConstantContract(
      JUST_SWAP_EXCHANGE_TRX_TEW,
      functionSelector,
      {},
      parameter
    );
    let LP = curWeb.BigNumber("0x" + transaction["constant_result"][0]);
    return LP;
  }

  const getTotalUsdFromTrxTewPool = async () => {
    let balance = await curWeb.trx.getBalance(JUST_SWAP_EXCHANGE_TRX_TEW);
    return balance * await getUsdPerTrx() / Math.pow(10, 6);
  }

  const getFeesFromTrx = async () => {
    try {
      let continueToken = '';
      let sumTrx = curWeb.toBigNumber(0);
      while (true) {
        let res = await curWeb.getEventResult(
          JUST_SWAP_EXCHANGE_TRX_TEW,
          {
            eventName: "TokenPurchase",
            onlyConfirmed: true,
            fingerprint: continueToken,
            order_by: "timestamp,asc",
            limit: 10000,
          });
        res.forEach(element => {
          sumTrx = sumTrx.plus(element.result[1]);
        });
        console.log(sumTrx);
        if (typeof res[res.length - 1].fingerprint == 'undefined') {
          break;
        } else {
          continueToken = res[res.length - 1].fingerprint;
        }
      }
    } catch (error) {
      console.error(error);
    } finally {

    }
  }
  const getFeesFromToken = () => {
    curWeb.getEventResult(JUST_SWAP_EXCHANGE_TRX_TEW, { eventName: "TrxPurchase", onlyConfirmed: true })
      .then(
        evt => {
          console.log(evt)
        }
      );
  }
  const initBalance = async () => {
    //console.log("INIT",curWeb);
    if (curWeb) {
      let curAddr = curWeb.defaultAddress.base58;
      setPublicAddress(curAddr);

      let totalPool = await getTotalSupplyOfPoolToken();
      let myPool = await getBalanceOfPoolToken();
      let percent = myPool.dividedBy(totalPool);
      //console.log("1",totalPool)
      //console.log("2",myPool)
      setRatio(percent.toNumber());
      setDollar(await getTotalUsdFromTrxTewPool());
    } else
      setRatio(0);
    getFeesFromTrx();
    //getFeesFromToken();
  };

  return (
    <>
      <Box className="pool-dt Minimize-dt" display="flex" flexDirection="row" alignItems="flex-end" alignContent="center">
        <h3>
          Total Liquidity
          <span style={{opacity:100}}>$ {dollar.toFixed(3)}</span>
        </h3>
        <PieChart
          style={{
            fontSize: "8px",
            width: "50%"
          }}
          labelStyle={{ fill: "#000000" }}
          lineWidth={15}
          data={[
            { title: "Your liquidity", value: (ratio * 100).toFixed(6) * 100000, color: "#B2E331" },

            { title: "test", value: 90, color: "#F6F7F8" }
          ]} />

        <h3 style={{ color: "#88ad26",opacity:100 }}>
          Your Share<span style={{opacity:100}}>{(ratio * 100).toFixed(6)} %</span>
        </h3>
      </Box>
    </>
  );
};

export default ProvideContainer;