import axios from "axios";
import { useContext, useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import { Link } from "react-router-dom";
import { TrendingCoins } from "../../Config/ApiConfig";
import { appContext } from "../../Utils/AppContext";
import "../../Styles/App.css";

const formatNumber = function (num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "$& ");
};

export default function CarrouselBanniere() {
  const [trendingCoins, setTrendingCoins] = useState<any[]>([]);

  const context = useContext(appContext);

  const fetchTrendingCoins = async () => {
    await axios
      .get(TrendingCoins(context.currentCurrency))
      .then(function (response) {
        // handle success
        setTrendingCoins(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  };

  useEffect(() => {
    fetchTrendingCoins();
  }, []);

  const itemsCarousel = trendingCoins.map((coin, key) => {
    const pourcentageIndication =
      coin.price_change_percentage_24h > 0 ? "+" : "";
    const stylePourcentage =
      coin.price_change_percentage_24h > 0
        ? { fontWeight: "bold", color: "green" }
        : { fontWeight: "bold", color: "red" };

    return (
      <Link key={key} to={`/coin/${coin.id}`}>
        <div
          className='itemCarousel'
        >
          <p className='coinName-itemCarousel'>{coin.name}</p>
          <p style={{ fontSize: 18 }}>
            {formatNumber(coin.current_price)} {context.symbol}
          </p>
          <p style={stylePourcentage}>
            {pourcentageIndication}
            {Math.floor(coin.price_change_percentage_24h * 100) / 100}% (
            {Math.floor(coin.market_cap_change_percentage_24h * 100) / 100}%)
          </p>
          <img
            src={coin.image}
            alt={coin.id}
            style={{ height: 80, margin: "0.5rem 0.5rem" }}
          />
        </div>
      </Link>
    );
  });

  const responsive = {
    0: { items: 2 },
    568: { items: 3 },
    1024: { items: 4 },
  };

  return (
    <div className='CarrouselBanniere'>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        autoPlay
        items={itemsCarousel}
      />
    </div>
  );
}
