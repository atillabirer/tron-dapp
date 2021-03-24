import { Box, Link, makeStyles } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import DefaultButton from "../../../components/Button/Default";
import DefaultInput from "../../../components/Input/Default";
import { TEW_TOKEN, getTronWeb, STEWKEN } from "../web/util";
import { toast, ToastContainer } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  maxInput: {
    float: "right",
  },
}));

const TewkenBakingContainer = () => {
  const classes = useStyles();
  //approve stewken to use tewken, bake and cake
  const [tewkenBalance, setTewkenBalance] = useState(0);
  const [publicAddress, setPublicAddress] = useState(0);
  const [bakeInput, setBakeInput] = useState(0);
  const [unbakeInput, setUnbakeInput] = useState(0)
  const [myTokens, setMyTokens] = useState(0)
  const [myDividends, setMyDividends] = useState(0);
  const [dividendsInput,setDividendsInput] = useState(0);
  const [withdrawInput, setWithdrawInput] = useState(0);
  const [trxDividends, setTrxDividends] = useState(0);


  const curWeb = getTronWeb();
  //get tewken balance
  const getTewkenBalance = async () => {
    if (curWeb) {
      let curAddr = curWeb.defaultAddress.base58;
      setPublicAddress(curAddr);
      if (true) {

        var functionSelector = "balanceOf(address)";

        var parameter = [
          {
            type: "address",
            value: curAddr,
          }
        ];

        let transaction = await curWeb.transactionBuilder.triggerConstantContract(
          TEW_TOKEN,
          functionSelector,
          {},
          parameter
        );
        let LP = curWeb.BigNumber("0x" + transaction["constant_result"][0]);
        setTewkenBalance((lpBalance) => (LP.toNumber() / Math.pow(10, 6)));
      }
    }
  }

  const getMyTokens = async () => {
    //console.log("INIT",curWeb);
    if (curWeb) {
      let curAddr = curWeb.defaultAddress.base58;
      setPublicAddress(curAddr);
      if (true) {

        var functionSelector = "myTokens()";

        var parameter = [
        ];

        let transaction = await curWeb.transactionBuilder.triggerConstantContract(
          STEWKEN,
          functionSelector,
          {},
          parameter
        );
        let LP = curWeb.BigNumber("0x" + transaction["constant_result"][0]);
        setMyTokens(LP.toNumber() / Math.pow(10, 6));
      }
    }

  };
  const getMyDividends = async () => {
    //console.log("INIT",curWeb);
    if (curWeb) {
      let curAddr = curWeb.defaultAddress.base58;
      setPublicAddress(curAddr);
      if (true) {

        var functionSelector = "myDividends(bool)";

        var parameter = [
          {
            type: "bool",
            value: true
          }
        ];

        let transaction = await curWeb.transactionBuilder.triggerConstantContract(
          STEWKEN,
          functionSelector,
          {},
          parameter
        );
        let LP = curWeb.BigNumber("0x" + transaction["constant_result"][0]);
        setMyDividends(LP.toNumber() / Math.pow(10, 6));
      }
    }

  };
  const getTrxDividends = async () => {
    //console.log("INIT",curWeb);
    if (curWeb) {
      let curAddr = curWeb.defaultAddress.base58;
      setPublicAddress(curAddr);
      if (true) {

        var functionSelector = "myDividends(bool)";

        var parameter = [
          {
            type: "bool",
            value: false
          }
        ];

        let transaction = await curWeb.transactionBuilder.triggerConstantContract(
          STEWKEN,
          functionSelector,
          {},
          parameter
        );
        let LP = curWeb.BigNumber("0x" + transaction["constant_result"][0]);
        setTrxDividends(LP.toNumber() / Math.pow(10, 6));
      }
    }

  };
  const approveTewkenSpend = async () => {
    try {
      var functionSelector = "approve(address,uint256)";
      var options = {
        feeLimit: 40000000
      };
      var parameter = [
        {
          type: "address",
          value: STEWKEN,
        },
        {
          type: "uint256",
          value: 1000000000000000,
        }
      ];

      let transaction = await curWeb.transactionBuilder.triggerSmartContract(
        TEW_TOKEN,
        functionSelector,
        options,
        parameter
      );
      const signedTransaction = await curWeb.trx.sign(transaction.transaction);
      if (!signedTransaction.signature) {
        return console.error('Transaction was not signed properly');
      }
      const broadcast = await curWeb.trx.sendRawTransaction(signedTransaction);
      return broadcast.txid;

    } catch (error) {
      toast.warn(error)
    }

  }


  const bake = async () => {
    //e.preventDefault();
    
    try {
      await approveTewkenSpend();
      if (bakeInput <= tewkenBalance) {

        var functionSelector = "stake(uint256)";

        var parameter = [
          {
            type: "uint256",
            value: bakeInput * 1000000
          },
        ];
        console.log(parameter)

        let transaction = await curWeb.transactionBuilder.triggerSmartContract(
          STEWKEN,
          functionSelector,
          { feeLimit: 40000000 },
          parameter
        );
        //console.warn(transaction["constant_result"][0])
        const signedTransaction = await curWeb.trx.sign(transaction.transaction);
        if (!signedTransaction.signature) {
          return console.error('Transaction was not signed properly');
        }
        const broadcast = await curWeb.trx.sendRawTransaction(signedTransaction);
        if (broadcast.txid) {
          console.log(await curWeb.trx.getTransactionInfo(broadcast.txid));
          toast.success(broadcast.txid)
          await getTewkenBalance();
        }

      } else {
        alert("Stake input needs to be less than your total LP balance!")
      }
    } catch (error) {
      toast.warn(error)
    }
  }
  const unbake = async () => {
    //e.preventDefault();
    if(!window.confirm(`Warning: This action requres ${bakeInput / 10} TRX to perform.Continue?`)) {
      return;
    } 
    try {
      //await approveTewkenSpend();
      if (unbakeInput <= myTokens) {

        var functionSelector = "unstake(uint256)";

        var parameter = [
          {
            type: "uint256",
            value: unbakeInput * 1000000
          },
        ];
        console.log(parameter)
        console.log(Math.round(unbakeInput * 100000))

        let transaction = await curWeb.transactionBuilder.triggerSmartContract(
          STEWKEN,
          functionSelector,
          { feeLimit: 40000000, callValue: Math.round(unbakeInput * 100000)},
          parameter
        );
        //console.warn(transaction["constant_result"][0])
        const signedTransaction = await curWeb.trx.sign(transaction.transaction);
        if (!signedTransaction.signature) {
          return console.error('Transaction was not signed properly');
        }
        const broadcast = await curWeb.trx.sendRawTransaction(signedTransaction);
        if (broadcast.txid) {
          console.log(await curWeb.trx.getTransactionInfo(broadcast.txid));
          toast.success(broadcast.txid)
          await getTewkenBalance();
        }

      } else {
        alert("Unbake input needs to be less than your total staked balance!")
      }
    } catch (error) {
      toast.warn(error)
    }
  }
  const withdraw = async (isTewken) => {
    //e.preventDefault();
    try {
      //await approveTewkenSpend();
      if (dividendsInput <= myDividends) {

        var functionSelector = "withdraw(bool)";

        var parameter = [
          {
            type: "bool",
            value: isTewken
          },
        ];
        console.log(parameter)

        let transaction = await curWeb.transactionBuilder.triggerSmartContract(
          STEWKEN,
          functionSelector,
          { feeLimit: 40000000 },
          parameter
        );
        //console.warn(transaction["constant_result"][0])
        const signedTransaction = await curWeb.trx.sign(transaction.transaction);
        if (!signedTransaction.signature) {
          return console.error('Transaction was not signed properly');
        }
        const broadcast = await curWeb.trx.sendRawTransaction(signedTransaction);
        if (broadcast.txid) {
          console.log(await curWeb.trx.getTransactionInfo(broadcast.txid));
          toast.success(broadcast.txid)
          await getTewkenBalance();
        }

      } else {
        alert("Withdraw input needs to be less than your total rewards balance!")
      }
    } catch (error) {
      toast.warn(error)
    }
  }

  useEffect(() => {

    var interval = setInterval(function () {
      getTewkenBalance();
      getMyTokens();
      getMyDividends();
      getTrxDividends();
    }, 2000)
    return (() => clearInterval(interval))
    //approveTewkenSpend();
  }, [])
  //get TEWKEN transfer approval for tewken staking contract
  const maxBakeInput = () => {
    setBakeInput(tewkenBalance)
  }
  const maxUnbakeInput = () => {
    setUnbakeInput(myTokens)
  }
  return (
    <Box id="stakingb1ls1" className="in active">
      <ToastContainer
        position="top-right"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
      />
      <ToastContainer />
      <Box className="back-wrp">
        <ul>
          <li style={{width:"100%",textAlign:'center'}}>APY 22%</li>
        </ul>
        <Box className="clear"></Box>
      </Box>
      <Box className="table-wrp">
        <Box className="Textfield-wrp">
          <ul>
            <DefaultInput id="bakeInput"
              value={bakeInput}
              onChange={(e) => setBakeInput(e.target.value)}
              label="Stake"
              type="number"
              ></DefaultInput>
            <li>
              <h5 className={classes.maxInput}>{tewkenBalance}</h5>
              <Link href="#!" onClick={maxBakeInput}>
                <h4 className={classes.maxInput}>MAX</h4>
              </Link>
            </li>
          </ul>
          <DefaultButton label="Bake" onClick={bake}></DefaultButton>
          <Box className="clear"></Box>
        </Box>
        <Box className="Textfield-wrp">
          <ul>
            <DefaultInput type="number" id="unbakeInput" value={unbakeInput} onChange={(e) => setUnbakeInput(e.target.value)} label="Unstake"></DefaultInput>
            <li>
              <h5 className={classes.maxInput}>{myTokens}</h5>
              <Link href="#!" onClick={maxUnbakeInput}>
                <h4 className={classes.maxInput}>MAX</h4>
              </Link>
            </li>
          </ul>
          <DefaultButton onClick={unbake} label="Unbake"></DefaultButton>
          <Box className="clear"></Box>
        </Box>
        <Box className="Textfield-wrp table-wrp" >
         <Box className="LPT-wrp">
           <h6>Rewards</h6>
         <h3>{myDividends} <span>TEWKEN</span></h3>
         <DefaultButton onClick={() => withdraw(true)} label="Withdraw"></DefaultButton>
          
           </Box>
          <Box className="clear"></Box>
        </Box>
<Box className="Textfield-wrp table-wrp" >
         <Box className="LPT-wrp">
           <h6>TRX Rewards</h6>
         <h3>{trxDividends} <span>TRX</span></h3>
         <DefaultButton onClick={() => withdraw(false)} label="Withdraw"></DefaultButton>
          
           </Box>
          <Box className="clear"></Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TewkenBakingContainer;
