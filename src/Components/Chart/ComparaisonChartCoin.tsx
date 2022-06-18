import { CircularProgress} from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
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
import { ICoinNameId } from "../../Types/SingleCoinTypes";
import { chartPeriodes } from "../../Config/ChartPeriodes";
import "../../Styles/App.css";

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

const yAxis = ["y", "y1", "y2", "y3", "y4", "y5"];
const colorsLine = ["#00bbf9", "red", "orange", "white", "lightgrey", "pink"];

export default function ComparaisonChartCoin({
  datasCoins,
}: {
  datasCoins: ICoinNameId[];
}) {
  const [chartDatas, setChartDatas] = useState<any>({});
  const [periode, setPeriode] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [datasChart, setDatasChart] = useState<any>();

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

  const fetchChartDatas = (coinId: string) => {
    setIsLoading(true);
    axios
      .get(HistoricalChart(coinId, periode, context.currentCurrency))
      .then((response) => {
        chartDatas[coinId] = response.data.prices;
        setChartDatas(chartDatas);
        setDatasChart(initChart());
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    //On ajoute uniquement les datas du coin qui n'en a pas déjà
    //pour limiter les fetchs
    if (datasCoins) {
      for (const coin of datasCoins) {
        if (coin && !chartDatas[coin.id]) {
          fetchChartDatas(coin.id);
        }
      }

      //on compare la liste des coins a afficher avec la liste des datas que l'on affiche
      //on retire celle affiché en trop
      for (const coinAffiche in chartDatas) {
        if (
          !datasCoins
            .map((item) => {
              if (item) return item.id;
            })
            .includes(coinAffiche)
        ) {
          /* console.log("on retire " + coinAffiche + " des datas à afficher"); */
          delete chartDatas[coinAffiche];
          setDatasChart(initChart());
        }
      }
    }
  }, [context.currentCurrency, context.isLoading, datasCoins, chartDatas]);

  //useEffect pour le changement de periode à afficher  :
  //il faut fetcher tous les graphs
  useEffect(() => {
    //On ajoute uniquement les datas du coin qui n'en a pas déjà
    //pour limiter les fetchs
    if (datasCoins) {
      for (const coin of datasCoins) {
        if (coin /* && !chartDatas[coin.id] */) {
          fetchChartDatas(coin.id);
        }
      }
    }
  }, [periode]);

  useEffect(() => {
    for (const coin of datasCoins) {
      if (!chartDatas[coin.id]) fetchChartDatas(coin.id);
    }
  }, []);

  const handleClick = (value: number) => {
    setPeriode(value);
  };

  const initChart = () => {
    let labels: any[] = [];

    let myDataSets = [];
    /* if (!isLoading && !context.isLoading) { */
    labels = (Object.values(chartDatas)[0] as any[]).map((item: any) => {
      let dateData = new Date(item[0]);
      if (periode === 1) {
        return dateData.toLocaleTimeString("fr").slice(0, 5);
      } else {
        return dateData.toLocaleDateString("fr");
      }
    });

    let yAxisIndex = 0;
    let indexColors = 0;

    for (const keyCoin in chartDatas) {
      let datasTemp = chartDatas[keyCoin].map((item: any) => {
        return item[1];
      });

      myDataSets.push({
        label: keyCoin,
        data: datasTemp,
        borderColor: colorsLine[indexColors],
        backgroundColor: colorsLine[indexColors],
        yAxisID: yAxis[yAxisIndex],
      });
      yAxisIndex++;
      indexColors++;
    }
    /*  } */

    const data = {
      labels,
      datasets: myDataSets,
    };
    return data;
  };

  if (!datasChart || Object.keys(datasChart).length === 0) {
    return <CircularProgress />;
  } else {
    return (
      <div>
        <div className='chartDiv'>
          <Line options={options} data={datasChart} />
        </div>
        <div className='chartButtonDiv'>
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
