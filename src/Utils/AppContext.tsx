import axios from "axios";
import { stringify } from "querystring";
import React, { createContext, useEffect, useState } from "react";
import { CoinList } from "../Config/ApiConfig";
import { ICoinNameId } from "../Types/SingleCoinTypes";

export type IAppContext = {
  currentCurrency: string;
  symbol: string;
  setCurrentCurrency: (arg: string) => void;
  listCoins: any[];
  setCoinSelected: (arg: string) => void;
  coinSelected: string;
  isLoading: boolean;
};

export const appContext = createContext<IAppContext>({
  currentCurrency: "USD",
  symbol: "$",
  setCurrentCurrency: (arg: string) => {},
  listCoins: [{ name: "Bitcoin", id: "bitcoin" }],
  setCoinSelected: (arg: string) => {},
  coinSelected: "bitcoin",
  isLoading: true,
});

export default function AppContext({ children }: { children: JSX.Element }) {
  const [currentCurrency, setCurrentCurrency] = useState("USD");
  const [symbol, setSymbol] = useState("$");
  const [listCoins, setListCoins] = useState<any[]>([]);
  const [coinSelected, setCoinSelected] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchListCoins = async () => {
    setIsLoading(true);

    await axios
      .get(CoinList(currentCurrency))
      .then(function (response) {
        setListCoins(response.data);
      })
      .catch(function (error: any) {
        // handle error
        console.log(error);
      })
      .then(function () {
        setIsLoading(false);
        // always executed
      });
  };

  useEffect(() => {
    fetchListCoins();
  }, []);

  useEffect(() => {
    if (currentCurrency === "USD") setSymbol("$");
    else if (currentCurrency === "EUR") setSymbol("€");
    fetchListCoins();
  }, [currentCurrency]);

  return (
    <appContext.Provider
      value={{
        currentCurrency,
        symbol,
        setCurrentCurrency,
        listCoins,
        setCoinSelected,
        coinSelected,
        isLoading,
      }}>
      {children}
    </appContext.Provider>
  );
}
