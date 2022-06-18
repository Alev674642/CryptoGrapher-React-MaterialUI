import {
  Accordion,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormGroup,
  CircularProgress,
  Dialog,
  Alert,
  AlertTitle,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { appContext } from "../Utils/AppContext";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ComparaisonChartCoin from "../Components/Chart/ComparaisonChartCoin";
import { ICoinNameId } from "../Types/SingleCoinTypes";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Container } from "@mui/system";

export default function ComparaisonPage() {
  const context = useContext(appContext);
  const [localListCoin, setLocalListCoin] = useState<ICoinNameId[]>([]);
  //Tableau de boolean décrivant les états de chaques checkBox
  const [localCheckStateListCoin, setLocalCheckStateListCoin] = useState<
    boolean[]
  >(Array.from({ length: 100 }, (x, i) => (i === 0 ? true : false)));
  const [isLoading, setIsLoading] = useState(true);
  const [listToShow, setListToShow] = useState([
    { name: "Bitcoin", id: "bitcoin" },
  ]);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const [openAlert, setOpenAlert] = React.useState(false);
  const [openAlertNumberCharts, setOpenAlertNumberCharts] =
    React.useState(false);
  const [countCharts, setCountCharts] = useState(1);

  //quand le fetch du context est réalisé, on rappelle les méthodes set
  useEffect(() => {
    setIsLoading(true);

    setLocalListCoin(context.listCoins);
    setIsLoading(false);
  }, [context.listCoins]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: number
  ) => {
    if (key === 0) {
      //on ne retire pas bitcoin (pour simplifier)
      setOpenAlert(!openAlert);
    } else {
      localCheckStateListCoin[key] = !localCheckStateListCoin[key];
      if (localCheckStateListCoin[key]) {
        if (countCharts > 5) {
          //on n'ajoute pas plus de 6 charts (pour simplifier)
          setOpenAlertNumberCharts(!openAlertNumberCharts);
          localCheckStateListCoin[key] = !localCheckStateListCoin[key];
        } else {
          //ajout d'un chart à afficher
          listToShow[key] = localListCoin[key];
          setListToShow([...listToShow]);
          setCountCharts(countCharts + 1);
        }
      } else {
        //on veut retirer un chart
        delete listToShow[key];
        setListToShow([...listToShow]);
        setCountCharts(countCharts - 1);
      }
    }
  };

  const handleClickAlert = () => {
    setOpenAlert(!openAlert);
  };

  const handleClickAlertNumberChart = () => {
    setOpenAlertNumberCharts(!openAlertNumberCharts);
  };

  return (
    <div className='comparaisonPage'>
      <div className='selectsDiv'>
        <Container>
          <Accordion
            onChange={(e, expanded) => {
              setIsAccordionOpen(expanded);
            }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'>
              <Typography>Liste des devises</Typography>

              <KeyboardArrowDownIcon
                style={{
                  transform: isAccordionOpen ? "rotate(180deg)" : "",
                  transition: "all 0.3s",
                }}
              />
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup row={true}>
                {localListCoin.map((coin, key) => {
                  return (
                    <FormControlLabel
                      key={key}
                      control={
                        <Checkbox
                          checked={localCheckStateListCoin[key]}
                          onChange={(e) => handleChange(e, key)}
                        />
                      }
                      label={coin.name}
                    />
                  );
                })}
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        </Container>
        <Dialog open={openAlert} onClose={handleClickAlert}>
          <Alert>
            <AlertTitle>Information</AlertTitle>
            Vous ne pouvez pas retirer le graphique du Bitcoin.
          </Alert>
        </Dialog>
        <Dialog
          open={openAlertNumberCharts}
          onClose={handleClickAlertNumberChart}>
          <Alert>
            <AlertTitle>Information</AlertTitle>
            Vous ne pouvez pas comparer plus de 6 devises simultanément.
          </Alert>
        </Dialog>
      </div>
      <div className='chartDiv'>
        {isLoading && <CircularProgress />}
        {!isLoading && <ComparaisonChartCoin datasCoins={listToShow} />}
      </div>
    </div>
  );
}
