import { Box, Link } from "@material-ui/core";
import React, { useState } from "react";
import LiquidityStakingContainer from "./liquiditystaking";
import TewkenBakingContainer from "./tewkenbaking";

const StakingContainer = () => {

  const [isLiquidity , setIsLiquidity] = useState(true);

  const handleOnLiquidityStaking = ()=>{
    setIsLiquidity(true);
  }

  const handleOnTewkenBaking = ()=>{
    setIsLiquidity(false);
  }

  
  return (
    <Box id="stakingb1" className="in active">


      <ul className="nav nav-tabs nestedearntabs">
        <li className={isLiquidity ? "active" : ""}>
          <Link data-toggle="tab" href="#stakingb1ls2" onClick={handleOnLiquidityStaking}>
            Liquidity Staking
          </Link>
        </li>
        <li className={!isLiquidity ? "active" : ""}>
          <Link data-toggle="tab" href="#stakingb1ls1" onClick={handleOnTewkenBaking}>
            Tewken Staking 
          </Link>
        </li>
      </ul>
      <Box className="tab-content">
        {isLiquidity ? <LiquidityStakingContainer></LiquidityStakingContainer> : <TewkenBakingContainer></TewkenBakingContainer>}
      </Box>
    </Box>
  );
};

export default StakingContainer;
