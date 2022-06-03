import { CircularProgress, FormControlLabel, FormGroup } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Button from "@mui/material/Button";
import { HistoricalChart } from "../../Config/ApiConfig";
import { appContext } from "../../Utils/AppContext";
import { DatasSingleCoin } from "../../Types/SingleCoinTypes";
import { chartPeriodes } from "../../Config/ChartPeriodes";
import "../../Styles/App.css";
import Checkbox from "@mui/material/Checkbox";
import { ShowChart } from "@mui/icons-material";

interface IShowGraph {
  price: boolean;
  marketcap: boolean;
  volume: boolean;
}

export default function ChartCoin({
  datasCoin,
}: {
  datasCoin: DatasSingleCoin;
}) {
  const [chartDatas, setChartDatas] = useState<any[]>([]);
  const [chartDatasMarketCap, setChartDatasMarketCap] = useState<any[]>([]);
  const [chartDatasTotalVolume, setChartDatasTotalVolume] = useState<any[]>([]);
  const [periode, setPeriode] = useState(1);
  const [showGraph, setShowGrap] = useState<IShowGraph>({
    price: true,
    marketcap: false,
    volume: false,
  });

  let context = useContext(appContext);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const fetchChartDatas = () => {
    axios
      .get(HistoricalChart(datasCoin.id, periode, context.currentCurrency))
      .then((response) => {
        setChartDatas(response.data.prices);
        setChartDatasMarketCap(response.data.market_caps);
        setChartDatasTotalVolume(response.data.total_volumes);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  };

  useEffect(() => {
    fetchChartDatas();
  }, [context.currentCurrency, periode]);

  const handleClick = (value: number) => {
    setPeriode(value);
  };

  const handleChangeCheckBox = (arg: IShowGraph) => {
    setShowGrap(arg);
  };

  if (chartDatas === []) {
    return <CircularProgress />;
  } else {
    const options = {
      responsive: true,
      interaction: {
        mode: "index" as const,
        intersect: false,
      },
      elements: { point: { radius: 1 } },
      plugins: {
        legend: {
          display: false,
        },
      },
      stacked: false,
      scales: {
        y: {
          type: "linear" as const,
          display: true,
          position: "left" as const,
        },
        y1: {
          type: "linear" as const,
          display: true,
          position: "right" as const,
          grid: {
            drawOnChartArea: false,
          },
        },
        y2: {
          type: "linear" as const,
          display: true,
          position: "right" as const,
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    };

    let labels: any[] = [];
    let datas: any[] = [];
    let datasMarketCap: any[] = [];
    let datasTotalVolume: any[] = [];
    if (chartDatas !== []) {
      labels = chartDatas.map((item: any) => {
        let dateData = new Date(item[0]);
        if (periode === 1) {
          return dateData.toLocaleTimeString("fr").slice(0, 5);
        } else {
          return dateData.toLocaleDateString("fr");
        }
      });

      datas = chartDatas.map((item: any) => {
        return item[1];
      });
      datasMarketCap = chartDatasMarketCap.map((item: any) => {
        return item[1];
      });
      datasTotalVolume = chartDatasTotalVolume.map((item: any) => {
        return item[1];
      });
    }

    let myDataSets = [];
    if (showGraph.price) {
      myDataSets.push({
        label: datasCoin.name,
        data: datas,
        borderColor: "#00bbf9",
        backgroundColor: "#00bbf9",
        yAxisID: "y",
      });
    }
    if (showGraph.marketcap) {
      myDataSets.push({
        label: "Market cap",
        data: datasMarketCap,
        borderColor: "#7cddf5",
        backgroundColor: "#7cddf5",
        yAxisID: "y1",
      });
    }
    if (showGraph.volume) {
      myDataSets.push({
        label: "Total volume",
        data: datasTotalVolume,
        borderColor: "#e71c1c",
        backgroundColor: "#e71c1c",
        yAxisID: "y2",
      });
    }

    const data = {
      labels,
      datasets: myDataSets,
    };

    return (
      <div>
        <div className='chartDiv'>
          <Line options={options} data={data} />
        </div>
        <div className='chartButtonDiv'>
          <div className='checkBoxes'>
            <FormGroup row={true}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showGraph.price}
                    onChange={() =>
                      handleChangeCheckBox({
                        ...showGraph,
                        price: !showGraph.price,
                      })
                    }
                  />
                }
                label='Prix'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showGraph.marketcap}
                    onChange={() =>
                      handleChangeCheckBox({
                        ...showGraph,
                        marketcap: !showGraph.marketcap,
                      })
                    }
                  />
                }
                label='Market cap'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showGraph.volume}
                    onChange={() =>
                      handleChangeCheckBox({
                        ...showGraph,
                        volume: !showGraph.volume,
                      })
                    }
                  />
                }
                label='Volume'
              />
            </FormGroup>
          </div>
          <div className='buttonsPeriods'>
            {chartPeriodes.map((item, key) => {
              return (
                <Button
                  key={key}
                  variant='outlined'
                  className={
                    item.value === periode ? "buttonSelected" : "button"
                  }
                  onClick={() => handleClick(item.value)}>
                  {item.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
