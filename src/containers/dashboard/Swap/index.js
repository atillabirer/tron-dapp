import { Box, Link, makeStyles, Modal, Button, Slider, Typography, withStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import DefaultInput from "../../../components/Input/Default/index.js";
import { TEW_TOKEN, JUST_SWAP_EXCHANGE_TRX_TEW, getTronWeb } from "../web/util.js";
import arrowPath from "./../../../assets/image/arrow.png";
import LoadingOverlay from "react-loading-overlay";
import PuffLoader from 'react-spinners/PuffLoader';
import { toast, ToastContainer } from "react-toastify";
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import SlippageModal from "../../../components/Modal/SlippageModal.js";
import SwapModal from "../../../components/Modal/SwapModal";
//mport Wizard from "react-onboarding";
import Joyride from 'react-joyride';
import DashboardModal from "../../../components/Modal/DashboardModal";



const TronWeb = require("tronweb");

const useStyles = makeStyles((theme) => ({
  maxInput: {
    float: "right",
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    textAlign: "center"
  },
}));


const DLink = withStyles({
  root: {
    color: "#a9d92c",
  },
})(Link);


const SwapContainer = () => {
  const classes = useStyles();

  const trxName = "TRX";
  const tewName = "TEW";
  const [slippageTolerance, setSlippageTolerance] = useState(1);
  const price = 0.5;

  const [focusFrom, setFocusFrom] = useState(false);
  const [focusTo, setFocusTo] = useState(false);
  const [loaderAble, setLoaderAble] = useState(false);

  let curWeb = getTronWeb();
  const [publicAddress, setPublicAddress] = useState("");
  var [trxBalance, setTrxBalance] = useState(0);
  var [tewBalance, setTewBalance] = useState(0);
  var [modalOpen, setModalOpen] = useState(false);
  var [successModalOpen, setSuccessModalOpen] = useState(false);
  const [txid, setTxid] = useState("");  

  var setTrxBalanceBind = (val) => {
    setTrxBalance(val);
    trxBalance = val;
  }

  var setTewBalanceBind = (val) => {
    setTewBalance(val);
    tewBalance = val;
  }

  const [trxPerTew, setTrxPerTew] = useState(0);
  const [tewPerTrx, setTewPerTrx] = useState(0);

  const [trxPerTewOriginal, setTrxPerTewOriginal] = useState(0);

  const [fromTokenName, setFromName] = useState(trxName);
  const [toTokenName, setToName] = useState(tewName);
  const [fromBalance, setFromBalance] = useState(trxBalance);
  const [toBalance, setToBalance] = useState(tewBalance);
  const [slippageModalOpen, setSlippageModalOpen] = useState(false)
  const [dashboardModalOpen, setdashboardModalOpen] = useState(false);

  var [fromAmount, setFromAmount] = useState(0);
  var [toAmount, setToAmount] = useState(0);


  const [active, setActive] = useState(0);
  const getPrice = () => {
    let ret = swapMode ? trxPerTew : tewPerTrx;
    if (isNaN(ret) || !isFinite(ret)) return 0;
    return Math.floor(ret * Math.pow(10, 6)) / Math.pow(10, 6);
  }

  const getMinimumReceive = () => {
    return Math.floor(toAmount * 0.995 * Math.pow(10, 6)) / Math.pow(10, 6);
  }

  const getFee = () => {
    return Math.floor(fromAmount * 0.003 * Math.pow(10, 6)) / Math.pow(10, 6);
  }
  const handleClose = () => {
    setModalOpen(false)
    setActive(0);
  }

  const getPriceImpact = () => {
    if (trxPerTew == 0 || isNaN(trxPerTew)) return "0 %";
    let ret = trxPerTewOriginal / trxPerTew;
    ret = Math.floor(((100 - ret * 100) * 0.997) * 100) / 100;
    if (isNaN(ret) || !isFinite(ret)) return " 0 %";
    if (ret < 0.01) return "< 0.01 %";
    return ret + " %";
  }

  const setFromAmountBind = async (val) => {
    setFromAmount(val);
    fromAmount = val;
    let temp = 0;
    if (swapMode) {
      temp = await getTrxAmountFromTokenInput(fromAmount);
      setTrxPerTew((temp / fromAmount));
      setTewPerTrx((fromAmount / temp));
      setTrxPerTewOriginal(await getTrxAmountFromTokenInput(0.1) * 10);
    } else {
      temp = await getTokenAmountFromTrxInput(fromAmount);
      setTrxPerTew((fromAmount / temp));
      setTewPerTrx((temp / fromAmount));
      let tempPrice = await getTokenAmountFromTrxInput(0.1);
      setTrxPerTewOriginal(1 / tempPrice / 10);
    }
    setToAmount(temp);
    toAmount = temp;
  };

  const setToAmountBind = async (val) => {
    setToAmount(val);
    toAmount = val;
    let temp = 0;
    if (swapMode) {
      temp = await getTokenAmountFromTrxOutput(toAmount);
      setTrxPerTew((toAmount / temp));
      setTewPerTrx((temp / toAmount));
      setTrxPerTewOriginal(await getTrxAmountFromTokenInput(0.1) * 10);
    } else {
      temp = await getTrxAmountFromTokenOutput(toAmount);
      setTrxPerTew((temp / toAmount));
      setTewPerTrx((toAmount / temp));
      let tempPrice = await getTokenAmountFromTrxInput(0.1);
      setTrxPerTewOriginal(1 / tempPrice / 10);
    }
    setFromAmount(temp);
    fromAmount = temp;
  }

  var [swapMode, changeSwapMode] = useState(false);

  const changeSwapModeBind = (val) => {
    changeSwapMode(val);
    swapMode = val;
  }

  const [digit, setDigit] = useState(6);

  //const [toBalance, setToBalance] = useState(tewBalance);

  const initBalance = async () => {
    setLoaderAble(true);
    if (curWeb) {
      let curAddr = curWeb.defaultAddress.base58;
      setPublicAddress(curAddr);
      let balance = await curWeb.trx.getBalance(curAddr);
      setInterval(async () => {
        // curWeb = getTronWeb();
        // curAddr = curWeb.defaultAddress.base58;
        // setPublicAddress(curAddr);
        balance = await curWeb.trx.getBalance(curAddr);
        setTrxBalance(balance);

      }, 5 * 1000);
      setTrxBalance(balance);
      setFromBalance(balance);
      console.log(balance)
      let contract = await curWeb.contract().at(TEW_TOKEN);
      let currentValue = await contract.balanceOf(curAddr).call();
      let tokenDigit = await contract.decimals().call();
      setTewBalance(currentValue.toNumber());
      setInterval(async () => {
        setTewBalance((await contract.balanceOf(curAddr).call()).toNumber());
      }, 5 * 1000);
      setDigit(tokenDigit);

      setToBalance(currentValue.toNumber());
      changeMultiState(swapMode, true);
      //updateExtraInfo();
    }
    setLoaderAble(false);
  };

  const callPriceTransaction = async (functionSelector, param, options) => {
    try {
      setLoaderAble(true);
      let transaction = await curWeb.transactionBuilder.triggerConfirmedConstantContract(
        JUST_SWAP_EXCHANGE_TRX_TEW,
        functionSelector,
        options,
        param
      );
      let price = curWeb.BigNumber("0x" + transaction["constant_result"][0]);
      setLoaderAble(false);
      return price.toNumber() / Math.pow(10, 6);
    } catch (error) {
      return 0;
    }
  }

  const getTokenAmountFromTrxInput = async (amountOfTrx) => {

    var functionSelector = "getTrxToTokenInputPrice(uint256)";
    var parameter = [
      {
        type: "uint256",
        value: amountOfTrx * Math.pow(10, 6),
      },
    ];
    return callPriceTransaction(functionSelector, parameter, {});
  };

  const getTokenAmountFromTrxOutput = async (amountOfTrx) => {
    var functionSelector = "getTokenToTrxOutputPrice(uint256)";
    var parameter = [
      {
        type: "uint256",
        value: amountOfTrx * Math.pow(10, 6),
      },
    ];
    return callPriceTransaction(functionSelector, parameter, {});
  };

  const getTrxAmountFromTokenInput = async (amountOfToken) => {
    var functionSelector = "getTokenToTrxInputPrice(uint256)";
    var parameter = [
      {
        type: "uint256",
        value: amountOfToken * Math.pow(10, 6),
      },
    ];
    return callPriceTransaction(functionSelector, parameter, {});
  };

  const getTrxAmountFromTokenOutput = async (amountOfToken) => {
    var functionSelector = "getTrxToTokenOutputPrice(uint256)";
    var parameter = [
      {
        type: "uint256",
        value: amountOfToken * Math.pow(10, 6),
      },
    ];
    return callPriceTransaction(functionSelector, parameter, {});
  };

  useEffect(() => {
    initBalance();
  }, [curWeb]);

  const changeMultiState = (newMode, initcall) => {
    if (!newMode) {
      setFromName(trxName);
      setToName(tewName);
      //console.log(trxBalance);
      if (!initcall) {
        setFromBalance(trxBalance);
        setToBalance(tewBalance);
      }

      let temp = fromAmount;
      setFromAmount(toAmount);
      setToAmount(temp);
      setTrxPerTew((toAmount / fromAmount).toFixed(6));
      setTewPerTrx((fromAmount / toAmount).toFixed(6));

    } else {
      setToName(trxName);
      setFromName(tewName);
      if (!initcall) {
        setToBalance(trxBalance);
        setFromBalance(tewBalance);
      }
      let temp = fromAmount;
      setFromAmount(toAmount);
      setToAmount(temp);
      setTrxPerTew((fromAmount / toAmount).toFixed(6));
      setTewPerTrx((toAmount / fromAmount).toFixed(6));
    }
  }

  const handleSwapMode = () => {
    let newMode = !swapMode;
    changeSwapModeBind(newMode);
    changeMultiState(newMode, false);
    //updateExtraInfo();
  };

  const swapFromTrxToTew = async () => {
    try {
      var functionSelector = "trxToTokenSwapInput(uint256,uint256)";
      var options = {
        feeLimit: 100000000,
        callValue: 1000000 * fromAmount,
      };

      var parameter = [
        {
          type: "uint256",
          value: 1000000 * toAmount,
        },
        {
          type: "uint256",
          value: Math.round(Date.now() / 1000) * 1000 + 1000 * 20,
        },
      ];
      console.log(publicAddress)
      const transaction = await curWeb.transactionBuilder.triggerSmartContract(
        JUST_SWAP_EXCHANGE_TRX_TEW,
        functionSelector,
        options,
        parameter,
        curWeb.address.toHex(publicAddress)
      );
      console.log(transaction["constant_result"])
      const signedTransaction = await curWeb.trx.sign(transaction.transaction);
      if (!signedTransaction.signature) {
        return console.error('Transaction was not signed properly');
      }

      const broadcast = await curWeb.trx.sendRawTransaction(signedTransaction);
      toast.success(broadcast.txid)
      if(broadcast.txid) {
        setTxid(broadcast.txid)     
        setActive(1)
      }

    } catch (error) {
      toast.warn(error)
    }
  }


  const approve = async () => {
    try {
      var functionSelector = "approve(address, uint256)";
      var options = {};
      var parameter = [
        {
          type: "address",
          value: JUST_SWAP_EXCHANGE_TRX_TEW,
        },
        {
          type: "uint256",
          value: 1000000 * fromAmount,
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
    } catch (error) {
      console.log(error);
    }
  }

  const swapFromTewToTrx = async () => {
    try {
      var functionSelector = "tokenToTrxSwapInput(uint256,uint256,uint256)";
      var options = {
        feeLimit: 100000000
      };


      var parameter = [
        {
          type: "uint256",
          value: 1000000 * fromAmount,
        },
        {
          type: "uint256",
          value: 1000000 * toAmount,
        },
        {
          type: "uint256",
          value: Math.round(Date.now() / 1000) + 600,
        }
      ];
      console.log(parameter)

      let transaction = await curWeb.transactionBuilder.triggerSmartContract(
        JUST_SWAP_EXCHANGE_TRX_TEW,
        functionSelector,
        options,
        parameter
      );
      console.log(transaction)
      const signedTransaction = await curWeb.trx.sign(transaction.transaction);
      if (!signedTransaction.signature) {
        return console.error('Transaction was not signed properly');
      }

      const broadcast = await curWeb.trx.sendRawTransaction(signedTransaction);
      console.log(broadcast)
      if(broadcast.txid) {
        setTxid(broadcast.txid)        
        //setSuccessModalOpen(true)
        setActive(1);
      }
      toast.success(broadcast.txid, {
        closeOnClick: false
      })
    } catch (error) {
      toast.warn(error);
    }
  }

  const handleSwap = async () => {
    if (swapMode) {
      await approve();
      await swapFromTewToTrx();
    } else {
      console.log("SWAP");
      await swapFromTrxToTew();
    }
  };

  const popModal = () => {
    setModalOpen(true);

  }

  const closeModalAndHandle = () => {
    handleSwap();
  }
  const handleSliderChange = (event, newValue) => {
    setSlippageTolerance(newValue)
  }
  const handleSlippageModalClose = () => {
    setSlippageModalOpen(false)
  }
  const maxTo = () => {
    //set to amount to to balance
    setToAmountBind((toBalance / 1000000).toFixed(6));
  }
  const maxFrom = () => {
    setFromAmountBind((fromBalance / 1000000).toFixed(6));
    //set to amount to to balance
  }
  

  return (
    <>
    <Box id="Swap" className="tab-pane in active">
      
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
      <SlippageModal modalOpen={slippageModalOpen} 
      handleClose={handleSlippageModalClose}
      slippageTolerance={slippageTolerance}
      handleSliderChange={handleSliderChange}
      />
      <SwapModal modalOpen={modalOpen}
      handleClose={handleClose}
      swapMode={swapMode}
      fromAmount={fromAmount}
      toAmount={toAmount}
      slippageTolerance={slippageTolerance}
      handleSliderChange={handleSliderChange}
      closeModalAndHandle={closeModalAndHandle}
      txid={txid}
      active={active}
      setSlippageTolerance={setSlippageTolerance}
      />
      <DashboardModal open={dashboardModalOpen} close={() => setdashboardModalOpen(false)}/>
      
      
      <h3 className="demo">
        Instantly Trade TEWKENS{" "}
        <Link type="button" onClick={() => setSlippageModalOpen(true)}> 
          <i className="fas fa-cog"></i>
        </Link>
      </h3>
      <Box className="clear"></Box>

      <Box className="Textfield-wrp">
        <ul>
          <DefaultInput
            id="filled-basic"
            label="From"
            value={fromAmount}
            onFocus={(e) => {
              setFocusFrom(true);
            }
            }
            onBlur={(e) => {
              setFocusFrom(false);
            }
            }
            onChange={(e) => {
              if (focusFrom) {
                setFromAmountBind(e.target.valueAsNumber);
              }
              //updateExtraInfo();
            }}

            type="number"
          ></DefaultInput>
          <li>
            
            <h4 className={classes.maxInput}>
              <span>{((!swapMode ? trxBalance : tewBalance) / Math.pow(10, digit)).toFixed(4)}</span>
              {fromTokenName}
            </h4>
            
          <h5 className={classes.maxInput}><DLink href="#!" onClick={maxFrom}>MAX</DLink></h5>
          </li>
        </ul>
        <Box className="clear"></Box>
        <Box onClick={handleSwapMode}>
          <img className="arrow-img" src={arrowPath} alt="arrow" />
        </Box>
        <ul>
          <DefaultInput
            id="filled-basic"
            label="To"
            value={toAmount}
            onFocus={(e) => {
              setFocusTo(true);
            }
            }
            onBlur={(e) => {
              setFocusTo(false);
            }
            }
            onChange={(e) => {
              if (focusTo) {
                setToAmountBind(e.target.valueAsNumber);
              }
              //updateExtraInfo();
            }}
            type="number"
          ></DefaultInput>
          <li>
            
            <h4 className={classes.maxInput}>
              <span>{((swapMode ? trxBalance : tewBalance) / Math.pow(10, digit)).toFixed(4)}</span>
              {toTokenName}
            </h4>
            
          <h5 className={classes.maxInput}><DLink href="#!" onClick={maxTo}>MAX</DLink></h5>
          </li>
        </ul>
        <Box className="clear"></Box>
      </Box>
      <LoadingOverlay
        active={loaderAble}
        spinner={<PuffLoader />}
        text=""
      >
      </LoadingOverlay>
      <Box className="Price-wrp">
        <h2>
          Price{" "}
          <span>
            {getPrice()}{" "}
            {toTokenName} per {fromTokenName}
          </span>
        </h2>
        <h2>
          Slippage tolerance<span>{slippageTolerance}%</span>
        </h2>
      </Box>

      <Box onClick={popModal} className="main-btn">
        <Link href="#">Swap</Link>
      </Box>

      <Box className="table-wrp">
        <table className="table">
          <tbody>
            <tr>
              <td>Min received</td>
              <td>
                {getMinimumReceive()}{" "}
                {toTokenName}
              </td>
            </tr>
            <tr>
              <td>Price impact</td>
              <td>{getPriceImpact()}</td>
            </tr>
            <tr>
              <td>Liquidity provider fee</td>
              <td>
                {getFee()}{" "}
                {fromTokenName}
              </td>
            </tr>
          </tbody>
        </table>
      </Box>
      <Box className="tbs-fot">
        <Link href="#" onClick={() => setdashboardModalOpen(true)}>Dashboard</Link>
      </Box>
    </Box>
    </>
  );
};

export default SwapContainer;
