import * as React from "react";
import { useEffect } from "react";
import {
    AreaChart,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Area,
    Bar,
    BarChart,
    ResponsiveContainer
} from "recharts";
import { get } from "request";
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { makeStyles, Box, Link } from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));


export default function DashboardModal({ open, close }) {
    const [data, setData] = React.useState([0]);
    const classes = useStyles();
    const fetchData = async () => {
        //extract total_volumes from json
        try {
            //get 24 hour data from coingeko
            const response = await fetch("https://api.coingecko.com/api/v3/coins/tewken/market_chart?vs_currency=usd&days=max&interval=daily");
            const json = await response.json();
            //get the second row of each array
            //get the 24h data, transform it
            //into chart data like [1,2,3,4]
            console.log(json["prices"])
                const freshArr = json["prices"].map((one) => ({
                    
                    name: new Date(one[0]).toLocaleDateString(),
                    uv: one[1], //bs useless
                    price: (one[1]).toFixed(3), //chart point
                    amt: one[1]
                }))
                setData(freshArr)
            
        } catch (error) {
            alert(error);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    return (
        <Modal open={open} BackdropComponent={Backdrop} className={classes.modal}>
            <Fade in={open}>
                <div className={clsx(classes.paper, "tab-content")}>
                    <h3 className="text-center">24h Price</h3>
                    <AreaChart width={400} height={250} data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="price" stroke="#a9d92c" fill="#a9d92c" />
                    </AreaChart>

                    <Box className="main-button" onClick={close}>
                        <Link href="#" style={{ color: "white" }}>Close</Link>
                    </Box>
                </div>

            </Fade>
        </Modal>
    );
}
