import react from "react";
import "../../Styles/App.css";
import CarrouselBanniere from "./CarrouselBanniere";

const AccueilBanniere = () => {
  return (
    <div className='AccueilBanniere'>
      <div className='AccueilBanniereTitre'>
        <div>
          <h1 className='titre'>Crypto Grapher</h1>
          <h5 className='soustitre'>Graphiques de cryptomonnaies</h5>
        </div>
        <CarrouselBanniere />
      </div>
    </div>
  );
};

export default AccueilBanniere;
