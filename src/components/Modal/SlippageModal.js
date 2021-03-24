

import React from 'react'
import { Modal,Fade, makeStyles, Typography,Slider } from "@material-ui/core";

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

function SlippageModal({ modalOpen, handleClose, slippageTolerance, handleSliderChange }) {
    const classes = useStyles();
    return (
        <Modal
            open={modalOpen}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            className={classes.modal}

        >

            <Fade in={modalOpen}>
                <div className={classes.paper}>
                    <Typography id="discrete-slider-small-steps" gutterBottom>
                        Slippage Tolerance: {slippageTolerance}%
                    </Typography>
                    <Slider
                        defaultValue={slippageTolerance}
                        aria-labelledby="discrete-slider-small-steps"
                        step={0.1}
                        marks
                        min={0.1}
                        max={1}
                        valueLabelDisplay="auto"
                        onChange={handleSliderChange}
                    />
                </div>
            </Fade>
        </Modal>
    )
}

export default SlippageModal
