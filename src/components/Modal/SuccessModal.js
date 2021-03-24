import React from 'react'
import { Box, Link, makeStyles, Modal, Button, Slider, Typography, withStyles, Fade } from "@material-ui/core";


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

function SuccessModal({successModalOpen,setSuccessModalOpen,toAmount,fromAmount,slippageTolerance,txid,swapMode}) {
    
    const classes = useStyles()
    return (
        <Modal
            open={successModalOpen}
            onClose={() => setSuccessModalOpen(false)}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            className={classes.modal}

        >

            <Fade in={successModalOpen}>
                <div className={classes.paper}>
                    <h3 id="transition-modal-title">Success!</h3>
                    <hr />
                    <p>{swapMode ? "TEW" : "TRX"} : {fromAmount}</p>
                    <p>{swapMode ? "TRX" : "TEW"} : {toAmount}</p>
                    <Typography id="discrete-slider-small-steps" id="nigger" gutterBottom>
                        Slippage Tolerance: {slippageTolerance}%
      </Typography>
                    <p>TXID: <Link target="_blank" rel="noopener" href={`https://tronscan.io/#/transaction/${txid}`}>{txid}</Link></p>
                    <Button variant="outlined" onClick={() => setSuccessModalOpen(false)}>Close</Button>
                </div>
            </Fade>
        </Modal>
    )
}

export default SuccessModal
