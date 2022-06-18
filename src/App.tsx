import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./Styles/App.css";
import Header from "./Components/Header";
import CoinPage from "./Pages/CoinPage";
import Accueil from "./Pages/Accueil";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AppContext from "./Utils/AppContext";
import ComparaisonPage from "./Pages/ComparaisonPage";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <AppContext>
      <ThemeProvider theme={darkTheme}>
        <BrowserRouter>
          <div className='App'>
            <Header></Header>
            <Routes>
              <Route path='/' element={<Accueil />} />
              <Route path='/coin/:id' element={<CoinPage />} />
              <Route path='/comparaison/' element={<ComparaisonPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </AppContext>
  );
}

export default App;
