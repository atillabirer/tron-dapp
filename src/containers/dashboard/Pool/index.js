import { Box } from "@material-ui/core";
import React, { useState } from "react";
import AddLiquidityContainer from "./addliquidity";
import ProvideContainer from "./provide";
import ProvidedLiquidityContainer from "./providedliquidity";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const PoolContainer = (props) => {
  let {tronWeb} = props;
  const [pool, setPool] = useState(0);

  const handleOnAddLiquidity = ()=>{
    setPool(1);
  }

  const handleOnProvide = () =>{
    setPool(0);
  }

  const handleOnBack = () =>{
    setPool(0);
  }
  const triggerAlert = (message,success = true) => {
    if(toast.success) {
      toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        });
    } else {
      toast.warn(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        });
    }
  }

  return (
    <Box id="Pool" className="tab-pane in active">
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
      {pool === 0 ? (
        <ProvidedLiquidityContainer onAddLiquidity={handleOnAddLiquidity} onAlert={triggerAlert}></ProvidedLiquidityContainer>
      ) : pool === 1 ? (
        <AddLiquidityContainer onProvide={handleOnProvide} onAlert={triggerAlert} onBack={handleOnBack}></AddLiquidityContainer>
      ) : (
        <ProvideContainer></ProvideContainer>
      )}
    </Box>
  );
};

export default PoolContainer;
