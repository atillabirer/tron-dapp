import { Box, Link, makeStyles, withStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import theme from "../../../assets/theme/index.js";
import DefaultInput from "../../../components/Input/Default/index.js";
import { JUST_SWAP_FACTORY, TEW_TOKEN, JUST_SWAP_EXCHANGE_TRX_TEW, getTronWeb } from "../web/util.js";
import LoadingOverlay from "react-loading-overlay";
import PuffLoader from 'react-spinners/PuffLoader';


const useStyles = makeStyles((theme) => ({
  maxInput: {
    float: "right",
  },
}));

const DLink = withStyles({
  root: {
    color: "#a9d92c",
  },
})(Link);

const AddLiquidityContainer = ({ onProvide, onBack, onAlert }) => {
  const classes = useStyles();
  const trxName = "TRX";
  const tewName = "TEW";
  let curWeb = getTronWeb();
  const [loaderAble, setLoaderAble] = useState(false);
  const [focusFrom, setFocusFrom] = useState(false);
  const [focusTo, setFocusTo] = useState(false);
  const [publicAddress, setPublicAddress] = useState("");
  const [trxBalance, setTrxBalance] = useState(0);
  const [tewBalance, setTewBalance] = useState(0);
  const [lpBalance, setLPBalance] = useState(0);
  const [poolTrxBalance, setPoolTrxBalance] = useState(0);
  const [poolTewBalance, setPoolTewBalance] = useState(0);
  const [trxPerTew, setTrxPerTew] = useState(0);
  const [tewPerTrx, setTewPerTrx] = useState(0);

  var [trxAmount, setTrxAmount] = useState(0);
  var [tewAmount, setTewAmount] = useState(0);

  const setTrxAmountBind = (val) => {
    setTrxAmount(val);
    trxAmount = val;
    setTewAmount((trxAmount * tewPerTrx).toFixed(6));
  }

  const setTewAmountBind = (val) => {
    setTewAmount(val);
    tewAmount = val;
    setTrxAmount((tewAmount * trxPerTew).toFixed(6));
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
    console.log(LP);
  }
  
  const initBalance = async () => {
    //console.log("INIT",curWeb);
    if (curWeb) {
      setLoaderAble(true);
      let curAddr = curWeb.defaultAddress.base58;
      setPublicAddress(curAddr);
      let trxBalanceOfOwner = await curWeb.trx.getBalance(curAddr);
      let trxBalanceOfPool = await curWeb.trx.getBalance(JUST_SWAP_EXCHANGE_TRX_TEW);
      setTrxBalance(trxBalanceOfOwner);
      setPoolTrxBalance(trxBalanceOfPool);
      if (true) {
        let contract = await curWeb.contract().at(TEW_TOKEN);
        let tewBalanceOfOwner = await contract.balanceOf(curAddr).call();
        let tewBalanceOfPool = await contract.balanceOf(JUST_SWAP_EXCHANGE_TRX_TEW).call();
        setTewBalance(tewBalanceOfOwner.toNumber());
        setPoolTewBalance(tewBalanceOfPool.toNumber());
        //curWeb.bignumer
        setTrxPerTew(trxBalanceOfPool / tewBalanceOfPool);
        setTewPerTrx(tewBalanceOfPool / trxBalanceOfPool);

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
      setLoaderAble(false);
    }
  };

  useEffect(() => {
    initBalance();
  }, [curWeb]);

  const provide = async () => {
    setLoaderAble(true);
    try {
      await approve();
      await addLiquidity();
    } catch (error) {
      console.log(error);
    }
    setLoaderAble(false);
    onProvide();
  };

  const approve = async () => {
    try {
      var functionSelector = "approve(address,uint256)";
      var options = {};
      var parameter = [
        {
          type: "address",
          value: JUST_SWAP_EXCHANGE_TRX_TEW,
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
      
    } catch (error) {
      console.log(error);
    }

  }

  const addLiquidity = async () => {
    try {

      var functionSelector = "addLiquidity(uint256,uint256,uint256)";
      var options = {
        callValue: 1000000 * trxAmount,
        feeLimit: 40000000,
      };
      var parameter = [
        {
          type: "uint256",
          value: 1000000 ,
        },
        {
          type: "uint256",
          value: 1000000 * tewAmount,
        },
        {
          type: "uint256",
          value: Math.round(Date.now() / 1000) + 600,
        },
      ];
      console.log("Parameter:",parameter)
      console.log("Options:",options)
      let transaction = await curWeb.transactionBuilder.triggerSmartContract(
        JUST_SWAP_EXCHANGE_TRX_TEW,
        functionSelector,
        options,
        parameter
      );
      console.log(transaction["constant_result"])
      const signedTransaction = await curWeb.trx.sign(transaction.transaction);
      if (!signedTransaction.signature) {
        return console.error('Transaction was not signed properly');
      }
      const broadcast = await curWeb.trx.sendRawTransaction(signedTransaction);
      console.log(broadcast)
      onAlert("TXID:" + broadcast.txid)
    } catch (error) {
      onAlert(error,false)
    }
  };

  const removeLiquidity = async (lpBalance) => {
    let functionSelector = "removeLiquidity(uint256,uint256,uint256,uint256)";
    let parameter = [
      {
        type:"uint256",
        value: Math.round(lpBalance)
      },
       {
        type:"uint256",
        value: 1
      },
       {
        type:"uint256",
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
      { feeLimit: 40000000},
      parameter
    );
   
    const signedTransaction = await curWeb.trx.sign(transaction.transaction);
    if (!signedTransaction.signature) {
      return console.error('Transaction was not signed properly');
    }
    const broadcast = await curWeb.trx.sendRawTransaction(signedTransaction);
    if(broadcast.txid) {
      onAlert("Liquidity removed!: " + broadcast.txid)
      setLPBalance(0)
      onBack();
    }
  }

  const handleMaxTrxClick = () =>{
    setTrxAmount((trxBalance / 1000000).toFixed(6));
    setTewAmount(((trxBalance * tewPerTrx) / 1000000).toFixed(6));
  }
  
  const handleMaxTewClick = () =>{
    setTewAmount((tewBalance / 1000000).toFixed(6));
    setTrxAmount(((tewBalance * trxPerTew) / 1000000).toFixed(6));
  }
  
  return (
    <Box className="pool-wd-two">
    
      <Box className="pool-wrp">
        <Box className="titlebar">
          <h3>Provided Liquidity</h3>
        </Box>
      </Box>
      <Box className="clear"></Box>

      <Box className="back-wrp">
        <ul>
          <li>
            <Link
              href="#"
              className="pool-wrp2-btn-bck"
              onClick={(e) => {
                onBack();
              }}
            >
              <i className="far fa-long-arrow-left"></i> Back
            </Link>
          </li>
          <li>Liquidity</li>
          <li>
            <Link href="#">
              <i className="fas fa-cog"></i>
            </Link>
          </li>
        </ul>
        <Box className="clear"></Box>
      </Box>

      <Box className="Textfield-wrp">
        <ul>
          <DefaultInput
            id="filled-basic-trx"
            label="TRX"
            value={trxAmount}
            onFocus={(e) => {
              setFocusFrom(true);
            }
            }
            onBlur={(e) => {
              setFocusFrom(false);
            }
            }
            onChange={(e) => {
              if (focusFrom)
                setTrxAmountBind(e.target.value);
            }}
            type="number"
          ></DefaultInput>
          <li>
            <h5 className={classes.maxInput}>
              Balance {trxBalance / Math.pow(10, 6)}
            </h5>
            <h4 className={classes.maxInput}>
              <DLink href="#!" onClick={handleMaxTrxClick}>MAX</DLink>
            </h4>
          </li>
        </ul>
        <Box className="clear"></Box>
        <LoadingOverlay
          active={loaderAble}
          spinner={<PuffLoader />}
          text=""
        >
        </LoadingOverlay>
        <ul>
          <DefaultInput
            id="filled-basic-tew"
            label="TEW"
            value={tewAmount}
            onFocus={(e) => {
              setFocusTo(true);
            }
            }
            onBlur={(e) => {
              setFocusTo(false);
            }
            }
            onChange={(e) => {
              if (focusTo)
                setTewAmountBind(e.target.value);
            }}
            type="number"
          ></DefaultInput>
          <li>
            <h5 className={classes.maxInput}>
              Balance {tewBalance / Math.pow(10, 6)}
            </h5>
            <h4 className={classes.maxInput}>
              <DLink href="#!" onClick={handleMaxTewClick}>MAX</DLink>
            </h4>
          </li>
        </ul>
        <Box className="clear"></Box>
      </Box>
      <Box className="main-btn">
        <Link
          href="#"
          className="pool-wrp2-btn"
          onClick={(e) => {
            provide();
          }}
        >
          Provide
        </Link>
      </Box>

      <Box className="table-wrp">
        <Box className="Textfield-wrp">
          <h6>Price and Pool</h6>
          <ul>
            <li>
              <h5>TRX per TEW</h5>
              <h4>{trxPerTew.toFixed(6)}</h4>
            </li>
            <li>
              <h5>TEW per TRX</h5>
              <h4>{tewPerTrx.toFixed(6)}</h4>
            </li>
          </ul>
          <Box className="clear"></Box>
        </Box>
        
      </Box>
      <Box className="tbs-fot">
        <Link href="W">Dashboard</Link>
      </Box>
    </Box>
  );
};

export default AddLiquidityContainer;
