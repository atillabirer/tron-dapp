import { Box, Link } from "@material-ui/core";
import React from "react";

const DefaultButton = ({label , onClick})=>{
  const handleClick = (e) =>{
    e.preventDefault();
    onClick();
  }

  return (
    <Box className="main-btn" onClick={e=>{handleClick(e)}}>
      <Link href="#">{label}</Link>
    </Box>
  );
};

export default DefaultButton;