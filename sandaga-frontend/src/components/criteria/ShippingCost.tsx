import React, { FunctionComponent, useEffect, useState } from "react";
import Button from "../Button";
import Pencil from "../../assets/icons/Pencil";
import Close from "../../assets/icons/Close";
import Checkbox from "./Checkbox";
import LaPoste from "../../assets/icons/LaPoste";
import { AdInterface, FieldsInterface } from "../../interfaces/ads.interface";

interface SelectOption {
  name: string;
  value: string;
  label: string;
}

interface ShippingCostProps {
  adsData: AdInterface;
  field: FieldsInterface;
  onOptionSelected: (option: SelectOption) => void;
}

const ShippingCost: FunctionComponent<ShippingCostProps> = ({
  adsData,
  field,
  onOptionSelected,
}) => {
  const [checkboxData, setCheckboxData] = useState<string[]>([]);
  useEffect(() => {
    const svg = document.querySelector(".svg");
    svg?.addEventListener("click", handleClick);

  }, []);

  const handleClick = () => {
    const open = document.querySelector(".shipping-overlay");

    open?.classList.toggle("open");
  };

  const handleCheckbox = (e: any) => {
    const value = e.target.value;
    let copyCheckboxData = [...checkboxData];

    console.log()

    copyCheckboxData?.includes(value)
      ? copyCheckboxData.splice(copyCheckboxData.indexOf(value), 1)
      : copyCheckboxData?.push(value);

    setCheckboxData(copyCheckboxData);


    onOptionSelected({
      label: copyCheckboxData.toString(),
      name: field.name,
      value: copyCheckboxData.toString(),
    });
  };

  return (
    <div className="shipping">
      <label>
        Livraison{" "}
        <span className="status">
          {Object.values(adsData)[0] !== "" ? "Activé" : "Désactivé"}
        </span>
      </label>
      <p>
        Vous acceptez d’envoyer l’article à votre acheteur gratuitement via nos
        partenaires de livraison
      </p>
      <div className="partner">
        <div className="inner">
          <img
            src="/assets/images/svg/mondialrelay.svg"
            alt=""
            className="icon"
          />
          <span className="describe">Mondial Relay</span>
        </div>

        <div className="inner">
          <img src="/assets/images/svg/laposte.svg" alt="" className="icon" />
          <span className="describe">La Poste</span>
        </div>
      </div>
      <Button
        label="Modifier les modes de livraison"
        type="button"
        className="btn btn-shipping"
        iconLeft={<Pencil />}
        onClick={handleClick}
      />
      <div className="shipping-overlay">
        <div className="shipping-wrapper">
          <Close onClick={(e) => console.log(e)} />
          <div className="header">
            <label>Vos moyens de livraison</label>
            <span>Les frais de livraison sont à la charge de l’acheteur</span>
          </div>
          <div className="items">
            <div className="item">
              <div className="form-group">
                <label className="form-control">
                  <Checkbox
                    name="courrier-suivi"
                    value="courrier-suivi"
                    checkedData={Object.values(adsData).length > 0 && Object.values(adsData)[0].split(",")}
                    handleCheckbox={(event) => handleCheckbox(event)}
                  />
                  <span>Courrier suivi</span>
                  <LaPoste />
                </label>
              </div>
              <span className="status">Jusquà 2kg</span>
              <span className="details">Limité à 3 cm d’épaisseur</span>
            </div>
            <div className="item">
              <div className="form-group">
                <label className="form-control">
                  <Checkbox
                    name="mondial-relay"
                    value="mondial-relay"
                    checkedData={Object.values(adsData).length > 0 && Object.values(adsData)[0].split(",")}
                    handleCheckbox={(event) => handleCheckbox(event)}
                  />
                  <span>Mondial Relay</span>
                  <img src="/assets/images/svg/mondialrelay.svg" alt="" />
                </label>
              </div>
              <span className="status">Jusquà 30kg</span>
              <span className="details">
                La somme de la longueur, largeur et hauteur ne dépasse pas 150
                cm, et le côté le plus long ne dépasse pas 120 cm
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingCost;
