import { Box, Link } from "@material-ui/core";
import React, { useState } from "react";
import StakingContainer from "./staking";
import Joyride,{ACTIONS,EVENTS,STATUS}from "react-joyride";
import useCookie from "react-use-cookie";


const EarnContainer = (props) => {
  let {tronWeb} = props;
  const [isStaking , setIsStaking] = useState(true);
  const [beenHere,setBeenHere] = useCookie("stakingbeenHere","no");

  const handleOnStaking = ()=>{
    setIsStaking(true);
  }

  const handleOnGames = () =>{
    setIsStaking(false);
  }
  const steps = [
    {
      target: ".stakinge",
      content:"After you've earned some Tewkens from providing liquidity, withdraw them and lock them here by staking and earning even more Tewken! Repeat this process as much as you'd like!"
    }
  ]
  
  const joyrideCallback = ({action,index,status,type}) => {
    if(status === STATUS.FINISHED) {
      setBeenHere("yes")
    }
  }

  return (
    <Box id="Earn" className="tab-pane in active">
            {(beenHere === "no") && <Joyride debug={true} callback={joyrideCallback} steps={steps} run={true} continuous={true}/>}

      <ul className="nav nav-tabs stakinge">
        <li className={isStaking ? "active" : ""}>
          <a data-toggle="tab" href="#stakingb1" onClick={handleOnStaking}>
            Staking
          </a>
        </li>
      </ul>

      <Box className="tab-content">
        <StakingContainer></StakingContainer>
      </Box>
    </Box>
  );
};

export default EarnContainer;
