import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TableBody,
  CircularProgress,
  Pagination,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { Container, flexbox } from "@mui/system";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CoinList } from "../../Config/ApiConfig";
import { appContext } from "../../Utils/AppContext";

export const formatNumber = function (num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "$& ");
};

export default function TableauDevises() {
  const [datasTableau, setDatasTableau] = useState<any[]>([]);
  const [datasTableauFiltrees, setDataTableauFiltrees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recherche, setRecherche] = useState("");

  const [page, setPage] = useState(1);
  const [pagePagingation, setPagePagingation] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  const [longueurTableau, setLongueurTableau] = useState(15);

  const context = useContext(appContext);
  let navigate = useNavigate();

  useEffect(() => {
    setDatasTableau(context.listCoins);
    setDataTableauFiltrees(context.listCoins);
    setLoading(context.isLoading);
  }, [context.listCoins]);

  const handleSearch = (arg: string) => {
    setIsSearching(true);
    setRecherche(arg);
    setPage(1);
    setDataTableauFiltrees(
      datasTableau.filter(
        (item: any) =>
          item.name.toLowerCase().includes(arg.toLowerCase()) ||
          item.symbol.includes(arg.toLowerCase())
      )
    );
    if (arg.length === 0) {
      setPage(pagePagingation);
      setIsSearching(false);
    }
  };

  const paginateDatasTableauFiltrees = () => {
    if (!isSearching) {
      return datasTableauFiltrees.slice(
        (page - 1) * longueurTableau,
        (page - 1) * longueurTableau + longueurTableau
      );
    } else {
      return datasTableauFiltrees;
    }
  };

  return (
    <Container style={{ textAlign: "center", marginBottom: "2rem" }}>
      <h3
        style={{
          letterSpacing: "0.5rem",
          fontFamily: "Roboto",
          margin: "2rem 0",
          fontSize: "25px",
          fontWeight: "700",
        }}>
        Tableau des devises
      </h3>
      <TextField
        id='outlined-basic'
        label='🔎 Rechercher une devise '
        variant='outlined'
        style={{ width: "100%", margin: "0 0 1rem 0" }}
        value={recherche}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size='small' aria-label='simple table'>
            <TableHead style={{ backgroundColor: "#38a3a5" }}>
              <TableRow>
                <TableCell align='left'>#</TableCell>

                <TableCell>Devise</TableCell>
                <TableCell align='right'>Valeur</TableCell>
                <TableCell align='right'>Chgt 24H </TableCell>
                <TableCell align='right'>ATH</TableCell>
                <TableCell align='right'>Chgt ATH</TableCell>
                <TableCell align='right'>Market Cap</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginateDatasTableauFiltrees().map((row: any) => (
                <TableRow
                  hover
                  key={row.name}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:nth-of-type(odd)": {
                      backgroundColor: "#49556b",
                    },
                  }}
                  onClick={() =>
                    navigate(`/coin/${row.id}`, { replace: true })
                  }>
                  <TableCell align='left'>{row.market_cap_rank}</TableCell>
                  <TableCell component='th' scope='row'>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={row.image}
                        alt={row.name}
                        style={{ height: "30px", margin: "0 1rem 0 0" }}
                      />
                      {row.name}&nbsp;({row.symbol.toUpperCase()})
                    </div>
                  </TableCell>
                  <TableCell align='right'>
                    {formatNumber(row.current_price)}&nbsp;
                    {context.symbol}
                  </TableCell>
                  <TableCell
                    align='right'
                    style={
                      row.price_change_percentage_24h > 0
                        ? { color: "#38a3a5", fontWeight: "bold" }
                        : { color: "red", fontWeight: "bold" }
                    }>
                    {row.price_change_percentage_24h > 0 ? "+" : ""}
                    {row.price_change_percentage_24h.toFixed(2)}&nbsp;%
                  </TableCell>
                  <TableCell align='right'>
                    {formatNumber(row.ath)}&nbsp;
                    {context.symbol}
                  </TableCell>
                  <TableCell align='right'>
                    {(((row.current_price - row.ath) * 100) / row.ath).toFixed(
                      2
                    )}
                  </TableCell>
                  <TableCell align='right'>
                    {formatNumber(row.market_cap).toString().slice(0, -7)}M
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "1rem",
        }}>
        {!isSearching && (
          <Pagination
            count={Math.ceil(datasTableauFiltrees.length / longueurTableau)}
            onChange={(e, _page) => {
              setPage(_page);
              setPagePagingation(_page);
              window.scroll(0, 450);
            }}
          />
        )}
      </div>
    </Container>
  );
}
