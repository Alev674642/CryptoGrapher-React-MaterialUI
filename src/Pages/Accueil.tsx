import React, { useContext } from "react";
import AccueilBanniere from "../Components/Banniere/AccueilBanniere";
import TableauDevises from "../Components/TableauDevises/TableauDevises";
import { appContext } from "../Utils/AppContext";

export default function Accueil() {
  const devise = useContext(appContext);

  return (
    <div>
      <AccueilBanniere />
      <TableauDevises />
    </div>
  );
}
