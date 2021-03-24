import React, { useState } from 'react'
import { Box, Link, makeStyles, Modal, Button, Slider, Typography, withStyles, Fade, Input } from "@material-ui/core";
import clsx from "clsx";
import Ebene from "../../assets/image/Ebene 7.png";
import Check from "../../assets/image/check (4).png";
import {Checkmark} from "react-checkmark";

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
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        textAlign: "center"
    },
    underline: {
        '&:before': {
            color: "#b2e331",
            borderBottom: "1px solid #b2e331"
        }
    }

}));

const GreenSlider = withStyles({
    root: {
        color: "#B2E331",
        height: 5
    },
    track: {
        height: 5,
        borderRadius: 10
    },
    rail: {
        height: 5,
        borderRadius: 10,
        color: "#777777"
    }
})(Slider)

function SwapModal({ modalOpen,
    handleClose,
    swapMode,
    toAmount, fromAmount, slippageTolerance, handleSliderChange, closeModalAndHandle, active, txid,setSlippageTolerance }) {
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
                <div className={clsx(classes.paper, "main-wrapper")}>
                    <section className="tabs-wrp">
                        <ul className="nav nav-tabs">
                            <li className={active === 0 ? "active  swap-tab" : ""}>
                                <Link
                                    data-toggle="tab"
                                    href="#Swap"
                                >
                                    Step 1
            </Link>
                            </li>
                            <li className={active === 1 ? "active pool-tab" : "pool-tab"}>
                                <Link
                                    data-toggle="tab"
                                    href="#Pool"
                                >
                                    Step 2
            </Link>
                            </li>
                        </ul>

                        <Box className="tab-content tab-pane tabs-wrp" style={{ whiteSpace: "nowrap" }}>
                            {active === 0 ? (
                                <>

                                    <h4 id="transition-modal-title">Swap from {swapMode ? "TEW" : "TRX"} to {swapMode ? "TRX" : "TEW"}</h4>
                                    <table className="table table-borderless">
                                        <tr>
                                            <td>
                                                <h6 className="text-left">{swapMode ? "TEW:" : "TRX:"}</h6>
                                            </td>
                                            <td>
                                                <h6 className="text-right">{fromAmount}</h6>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <h6 className="text-left">{swapMode ? "TRX:" : "TEW:"}</h6>
                                            </td>
                                            <td>
                                                <h6 className="text-right">{toAmount}</h6>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                <h6 className="text-left">Slippage Tolerance:</h6>
                                            </td>
                                            <td>
                                               
                                    <Input type="number" className={classes.input} value={slippageTolerance} onChange={(e) => setSlippageTolerance(e.target.value)}/>
                                    %
                                            </td>
                                        </tr>
                                    </table>
                                    <GreenSlider
                                        defaultValue={slippageTolerance}
                                        value={slippageTolerance}
                                        aria-labelledby="discrete-slider-small-steps"
                                        step={0.1}
                                        marks
                                        min={0.1}
                                        max={2}
                                        valueLabelDisplay="auto"
                                        onChange={handleSliderChange}
                                    />
                                    <br />

                                    <Box onClick={closeModalAndHandle} className="main-button">
                                        <Link style={{ color: "#fff" }} href="#">Swap</Link>

                                    </Box>
                                </>
                            ) : active === 1 ? (
                                <>
                                <Box style={{position:"absolute",top:-70,left:"37%"}}>
                                <Checkmark size="xxLarge" color="#b2e331"/>
                                </Box>
                                   
                                    <h5>Swap Confirmed</h5>
                                    <br />
                                    <table className="table table-borderless">
                                        <tr>
                                            <td className="text-left"><h6>{swapMode ? "TEW" : "TRX"} Amount:</h6>
                                            </td>
                                            <td className="text-right">
                                                <h6> {fromAmount}</h6>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="text-left"><h6>{swapMode ? "TRX" : "TEW"} Amount:</h6>
                                            </td>
                                            <td className="text-right">
                                                <h6>{toAmount}</h6>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                <h6 className="text-left">Blockchain ID:</h6>
                                            </td>
                                            <td>
                                                <h6 className="text-right">
                                                    <a href={`http://tronscan.io/#/transaction/${txid}`}>See on Tronscan.io</a>

                                                </h6>
                                            </td>
                                        </tr>
                                    </table>

                                    <Box onClick={handleClose} className="main-button">
                                        <Link style={{ color: "#fff" }} href="#">Close</Link>

                                    </Box>
                                </>
                            ) : (
                                <Typography>Meh</Typography>
                            )}
                        </Box>
                    </section>
                </div>
            </Fade>
        </Modal>
    )
}

export default SwapModal
