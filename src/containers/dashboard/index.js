import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./../../assets/css/responsive.css";
import "./../../assets/css/style.css";
import logoPath from "./../../assets/image/logo.png";
import SwapContainer from "./Swap";
import PoolContainer from "./Pool";
import EarnContainer from "./Earn";
import { getTronWeb } from './web/util.js'
import { Box, Link, Modal, Fade, makeStyles } from "@material-ui/core";
import Joyride,{ACTIONS,EVENTS,STATUS}from "react-joyride";
import useCookie, { setCookie } from "react-use-cookie";

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

const DashboardContainer = () => {
  const classes = useStyles();

  const [tronWeb, setTronWeb] = useState(null);
  const [active, setActive] = useState(0);
  const [currentCount, setCount] = useState(200);
  const [wall, setWall] = useState(true)
  const [beenHere, setBeenHere] = useCookie('beenHere',"no");
  const earnRef = useRef(null);

  const timer = () => {
    //console.log(currentCount)
    let curtronWeb = getTronWeb();
    if (curtronWeb) {
      setCount(0);
      setTronWeb(curtronWeb);
      if(curtronWeb?.ready) {
        setWall(false)
      } else {
        setWall(true)
      }
    }
    
    else
      setCount(currentCount - 1);
  }

  useEffect(
    () => {
      if (currentCount <= 0) {
        return;
      }
      const id = setInterval(timer, 1000);
      //return () => clearInterval(id);
    },
    [currentCount]
  );

  const joyrideCallback = ({action,index,status,type}) => {
    if(status === STATUS.FINISHED) {
      setBeenHere("yes")
      earnRef.current.click();
    }
  }

  const steps = [
    {
      target: ".swap-tab",
      content: "Start by swapping some TRX for TEW here."
    },
    {
      target: ".pool-tab",
      content: "Add liquidity by pairing your shiny new Tewkens with Trx. In return you will get Liquidity tokens that you can lock and earn more Tewkens. "
    },
    {
      target: ".earn-tab",
      content: "Lock you liquidity tokens here and earn more Tewkens. Dont worry, you can unlock them  and get your Tewken and Trx back at any time."
    },
  ]

  return (
    <>
    <Modal
  open={wall}
  onClose={() => (true)}
  aria-labelledby="simple-modal-title"
  aria-describedby="simple-modal-description"
>
<Fade in={wall}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Log in to TronLink</h2>
            <p id="transition-modal-description">This website requires TronLink or another TronWeb provider to function.</p>
          </div>
        </Fade>
</Modal>
    <Box className="main-wrapper inner-page-wrapper minimize-wrp">
      {(beenHere === "no") && <Joyride debug={true} callback={joyrideCallback} steps={steps} run={true} continuous={true}/>}
      
      <link
        rel="stylesheet"
        href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css"
        integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p"
        crossOrigin="anonymous"
      />
      <Box className="logo-wrp">
        <img src={logoPath} alt="logo" />
      </Box>

      <section className="tabs-wrp">
        <ul className="nav nav-tabs">
          <li className={active === 0 ? "active  swap-tab" : ""}>
            <Link
              data-toggle="tab"
              href="#Swap"
              onClick={(e) => {
                setActive(0);
              }}
            >
              Swap
            </Link>
          </li>
          <li className={active === 1 ? "active pool-tab" : "pool-tab"}>
            <Link
              data-toggle="tab"
              href="#Pool"
              onClick={(e) => {
                setActive(1);
              }}
            >
              Pool
            </Link>
          </li>
          <li className={active === 2 ? "active earn-tab" : "earn-tab"}>
            <Link
              id="earnLink"
              data-toggle="tab"
              href="#Earn"
              ref={earnRef}
              onClick={(e) => {
                setActive(2);
              }}
            >
              Earn
            </Link>
          </li>
        </ul>

        <Box className="tab-content">
          {active === 0 ? (
            <SwapContainer />
          ) : active === 1 ? (
            <PoolContainer />
          ) : (
                <EarnContainer />
              )}
        </Box>
      </section>
    </Box>
    </>
  );
};

export default DashboardContainer;
