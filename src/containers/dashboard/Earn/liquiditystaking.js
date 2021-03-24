import React, { useEffect, useState } from "react";
import { Box, Link, makeStyles } from "@material-ui/core";
import DefaultInput from "../../../components/Input/Default";
import DefaultButton from "../../../components/Button/Default";
import { JUST_SWAP_EXCHANGE_TRX_TEW, TEW_TOKEN, getTronWeb, FTEWKEN } from "../web/util";
import { toast,ToastContainer } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  maxInput: {
    float: "right",
  },
}));

const LiquidityStakingContainer = () => {
  const classes = useStyles();
  const [lpBalance, setLPBalance] = useState(0);
  const [ftewken, setFtewken] = useState(0);
  const [dividends, setDividends] = useState(0);
  const [stakeInput, setStakeInput] = useState(0);
  const [unstakeInput, setUnstakeInput] = useState(0);
  const [withdrawInput,setWithdrawInput] = useState(0);

  const [publicAddress, setPublicAddress] = useState("");
  let curWeb = getTronWeb();
  const initBalance = async () => {
    //console.log("INIT",curWeb);
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
          JUST_SWAP_EXCHANGE_TRX_TEW,
          functionSelector,
          {},
          parameter
        );
        let LP = curWeb.BigNumber("0x" + transaction["constant_result"][0]);
        setLPBalance((lpBalance) => (LP.toNumber() / Math.pow(10, 6)));
      }
    }

  };
  const getFtwekenBalance = async () => {
    //console.log("INIT",curWeb);
    if (curWeb) {
      let curAddr = curWeb.defaultAddress.base58;
      setPublicAddress(curAddr);
      if (true) {

        var functionSelector = "myTokens(bool)";

        var parameter = [
          {
            type: "bool",
            value: false
          }
        ];

        let transaction = await curWeb.transactionBuilder.triggerConstantContract(
          FTEWKEN,
          functionSelector,
          {},
          parameter
        );
        let LP = curWeb.BigNumber("0x" + transaction["constant_result"][0]);
        setFtewken(LP.toNumber() / Math.pow(10, 6));
      }
    }

  };

  const getDividends = async () => {
    //console.log("INIT",curWeb);
    if (curWeb) {
      let curAddr = curWeb.defaultAddress.base58;
      setPublicAddress(curAddr);
      if (true) {

        var functionSelector = "myDividends(bool,bytes32)";

        var parameter = [
          {
            type: "bool",
            value: false
          },
          {
            type: "bytes32",
            value: "0x7465776b656e54726f6e00000000000000000000000000000000000000000000"
          }
        ];

        let transaction = await curWeb.transactionBuilder.triggerConstantContract(
          FTEWKEN,
          functionSelector,
          {},
          parameter
        );
        let LP = curWeb.BigNumber("0x" + transaction["constant_result"][0]);
        setDividends(LP.toNumber() / Math.pow(10, 6));
      }
    }

  };





  const approve = async () => {
    try {
      var functionSelector = "approve(address,uint256)";
      var options = {
        feeLimit: 40000000
      };
      var parameter = [
        {
          type: "address",
          value: FTEWKEN,
        },
        {
          type: "uint256",
          value: 1000000000000000,
        }
      ];

      let transaction = await curWeb.transactionBuilder.triggerSmartContract(
        JUST_SWAP_EXCHANGE_TRX_TEW,
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

  const stake = async () => {
    //e.preventDefault();
    try {
      await approve();
      if (stakeInput <= lpBalance) {

        var functionSelector = "stake(uint256)";

        var parameter = [
          {
            type: "uint256",
            value: stakeInput * 1000000
          },
        ];
        console.log(parameter)

        let transaction = await curWeb.transactionBuilder.triggerSmartContract(
          FTEWKEN,
          functionSelector,
          {feeLimit: 40000000},
          parameter
        );
        //console.warn(transaction["constant_result"][0])
        const signedTransaction = await curWeb.trx.sign(transaction.transaction);
        if (!signedTransaction.signature) {
          return console.error('Transaction was not signed properly');
        }
        const broadcast = await curWeb.trx.sendRawTransaction(signedTransaction);
        if(broadcast.txid) {
          console.log(await curWeb.trx.getTransactionInfo(broadcast.txid));
          toast.success(broadcast.txid)
        }

      } else {
        alert("Stake input needs to be less than your total LP balance!")
      }
    } catch (error) {
      toast.warn(error)
    }
  }
  const unstake = async () => {
    //e.preventDefault();
    
    try {
      await approve();
      if (unstakeInput <= ftewken) {

        var functionSelector = "unstake(uint256)";

        var parameter = [
          {
            type: "uint256",
            value: unstakeInput * 1000000
          },
        ];
        console.log(parameter)

        let transaction = await curWeb.transactionBuilder.triggerSmartContract(
          FTEWKEN,
          functionSelector,
          {feeLimit: 40000000},
          parameter
        );
        //console.warn(transaction["constant_result"][0])
        const signedTransaction = await curWeb.trx.sign(transaction.transaction);
        if (!signedTransaction.signature) {
          return console.error('Transaction was not signed properly');
        }
        const broadcast = await curWeb.trx.sendRawTransaction(signedTransaction);
        if(broadcast?.txid) {
          toast.success(broadcast.txid)
         
        }


      } else {
        alert("Unstake input needs to be less than your total staked LP balance!")
      }
    } catch (error) {
      toast.warn(error)
    }
  }
  const withdraw = async () => {
    //e.preventDefault();
    
    try {
      await approve();
      if (withdrawInput <= dividends) {

        var functionSelector = "withdraw(bytes32)";

        var parameter = [
          {
            type: "bytes32",
            value: "0x7465776b656e54726f6e00000000000000000000000000000000000000000000" 
          },
        ];
        console.log(parameter)

        let transaction = await curWeb.transactionBuilder.triggerSmartContract(
          FTEWKEN,
          functionSelector,
          {feeLimit: 40000000},
          parameter
        );
        //console.warn(transaction["constant_result"][0])
        const signedTransaction = await curWeb.trx.sign(transaction.transaction);
        if (!signedTransaction.signature) {
          return console.error('Transaction was not signed properly');
        }
        const broadcast = await curWeb.trx.sendRawTransaction(signedTransaction);
        if(broadcast?.txid) {
          toast.success(broadcast.txid)
        }
      


      } else {
        alert("Withdraw input needs to be less than your total dividends!")
      }
    } catch (error) {
      toast.warn(error)
    }
  }
  const maxStake = () => {
    setStakeInput(lpBalance);
  }

  const maxUnstake = () => {
    setUnstakeInput(ftewken);
  }
  
  const maxDividends = () => {
    setWithdrawInput(dividends);
  }

  useEffect(() => {
   var interval = setInterval(() => {
    initBalance();
    getFtwekenBalance();
    getDividends();
   },2000)
   return () => clearInterval(interval)
    
  }, [])



  return (
    <Box id="stakingb1ls2" className="in active">
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
          <li>
            <Link href="#" className="pool-wrp2-btn-bck">
              <i className="far fa-long-arrow-left"></i> Back
            </Link>
          </li>
          <li>APY 176%</li>
          <li>
            <Link href="#!">
              <i className="fas fa-cog"></i>
            </Link>
          </li>
        </ul>
        <Box className="clear"></Box>
      </Box>

      <Box className="table-wrp">
        <Box className="Textfield-wrp LPT-wrp">
          <h6>{lpBalance} LP</h6>
          <ul>
            <DefaultInput
             id="stakeInput"
              label="Stake"
              value={stakeInput}
              onChange={(e) => setStakeInput(e.target.valueAsNumber)}
              type="number"
            />

            <li>
              <h6 className={classes.maxInput}> <span>{lpBalance}</span></h6>
              <Link href="#!" onClick={maxStake}>
                <h4 className={classes.maxInput}>MAX</h4>
              </Link>
            </li>
          </ul>
          <DefaultButton type="button" label="Stake" onClick={stake}></DefaultButton>
          <Box className="clear"></Box>
        </Box>
        <Box className="Textfield-wrp LPT-wrp">
          <h6>Staked: {ftewken}</h6>
          <ul>
            <DefaultInput id="unstakeInput" 
            value={unstakeInput} 
            onChange={(e) => setUnstakeInput(e.target.value)}  
            label="Unstake"
            type="number"
            ></DefaultInput>
            <li>
              <h5 className={classes.maxInput}>{ftewken}</h5>
              <Link href="#!" onClick={maxUnstake}>
                <h4 className={classes.maxInput}>MAX</h4>
              </Link>
            </li>
          </ul>
          <DefaultButton onClick={unstake} label="Unstake"></DefaultButton>
          <Box className="clear"></Box>
        </Box>
        <Box className="Textfield-wrp LPT-wrp">
          <h6>Rewards: {dividends}</h6>
          <ul>
            <DefaultInput  type="number" id="withdrawInput" label="Withdraw" value={withdrawInput} onChange={(e) => setWithdrawInput(e.target.value)}></DefaultInput>
            <li>
              <h5 className={classes.maxInput}><span>{dividends}</span></h5>
              <Link href="#!" onClick={maxDividends}>
                <h4 className={classes.maxInput}>MAX</h4>
              </Link>
            </li>
          </ul>
          <DefaultButton label="Withdraw" onClick={withdraw}></DefaultButton>
          <Box className="clear"></Box>
        </Box>


      </Box>
    </Box>
  );
};

export default LiquidityStakingContainer;
