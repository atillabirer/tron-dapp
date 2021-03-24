import { Box, Link } from "@material-ui/core";
import React from "react";

const GamesContainer = () => {
  return (
    <Box id="stakingb2" className="">
      <Box className="back-wrp">
        <ul>
          <li>
            <Link href="#" className="pool-wrp2-btn-bck">
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
    </Box>
  );
};

export default GamesContainer;
