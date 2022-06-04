import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { SingleCoin } from "../Config/ApiConfig";
import "../Styles/App.css";
import { DatasSingleCoin } from "../Types/SingleCoinTypes";
import parse from "html-react-parser";
import { formatNumber } from "../Components/TableauDevises/TableauDevises";
import ChartCoin from "../Components/Chart/ChartCoin";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />;
});

export default function CoinPage() {
  const { id = "" } = useParams();
  const [datas, setDatas] = useState({} as DatasSingleCoin);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchInfoCoin = () => {
    setLoading(true);
    if (id !== undefined) {
      axios
        .get(SingleCoin(id))
        .then(function (response) {
          // handle success
          setDatas(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .then(function () {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchInfoCoin();
  }, [id]);

  if (loading) return <CircularProgress />;

  return (
    <div className='infoAndChart' style={{ padding: "1rem 0rem" }}>
      <div className='infoPart' style={{ padding: "1rem 1rem" }}>
        <img src={datas.image.large} alt={datas.name} height='100px' />
        <h1> {datas.name}</h1>
        <br />
        <p
          className='descriptionCoin'
          onClick={() => setOpenDialog(!openDialog)}>
          {parse(datas.description.en.split(". ")[0])}...
        </p>

        <br />
        <div
          style={{
            textAlign: "start",
            width: "100%",
          }}>
          <p>
            <strong>Prix actuel :</strong>{" "}
            {formatNumber(datas.market_data.current_price.usd)} $
          </p>
          <p>
            <strong>Market cap : </strong>
            {formatNumber(datas.market_data.market_cap.usd)} $
          </p>
          <p>
            <strong>community_score : </strong>
            {formatNumber(datas.market_data.high_24h.usd)} $
          </p>
          <p>
            <strong>developer_score : </strong>
            {formatNumber(datas.market_data.low_24h.usd)} $
          </p>
        </div>
        <br />
        <div
          style={{
            textAlign: "start",
            width: "100%",
          }}>
          <p>
            <strong>coingecko_rank : </strong>
            {datas.coingecko_rank}
          </p>
          <p>
            <strong>coingecko_score : </strong>
            {datas.coingecko_score}
          </p>
          <p>
            <strong>community_score : </strong>
            {datas.community_score}
          </p>
          <p>
            <strong>developer_score : </strong>
            {datas.developer_score}
          </p>
        </div>

        <br />
      </div>
      <div className='chartPart'>
        <ChartCoin datasCoin={datas}></ChartCoin>
      </div>
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => {
          setOpenDialog(false);
        }}
        aria-describedby='alert-dialog-slide-description'>
        <DialogTitle>{datas.name}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>
            {parse(datas.description.en)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false);
            }}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
