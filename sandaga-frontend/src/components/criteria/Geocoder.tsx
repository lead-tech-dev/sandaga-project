import { FunctionComponent, useEffect, useState } from "react";

import MapBoxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { useControl } from "react-map-gl/maplibre";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

interface GeocoderProps {
  handleResult: (e: any) => void;
  adsData: any;
}

const Geocoder: FunctionComponent<GeocoderProps> = ({
  handleResult,
  adsData,
}) => {
  const [inputText, setInputText] = useState<string>("");
  const ACCESS_TOKEN =
    "pk.eyJ1IjoibWF4aW1hbjgxIiwiYSI6ImNrZXBuaGE3ZTA0NXMycHI2NWoxcGx1cjEifQ.YIL3v3KgW2cmLB9e5lS_rA";

  const onMapMoved = (newState: any) => {
    // Ignore new area changes from Map
    // if (this.state.area) {
    //     delete newState.area;
    // }

    requestAnimationFrame(() => {
      // setNewState(newState);
    });
  };
  const reverseGeocode = (query: string): any => {
    if (query !== "cafe") {
      return [];
    }
  };

  const ctrl = new MapBoxGeocoder({
    accessToken: ACCESS_TOKEN,
    marker: false,
    collapsed: true,
    placeholder: "Renseignez votre adresse ou votre ville",
    // bbox: [-122.30937, 37.84214, -122.23715, 37.89838],
    types: "address",
    /*proximity: {
      longitude: -122.25948,
      latitude: 37.87221,
    },*/
    countries: "fr",
    //localGeocoder: reverseGeocode,
    //reverseGeocode: true,
    //clearOnBlur: true,
    //flyTo: false,
  });

  useControl(() => ctrl);

  ctrl.on("result", (e: any) => {
    //console.log(e.result);
    const coords = e.result.geometry.coordinates;

    //console.log(e);
    handleResult(e);
  });

  return null;
};

export default Geocoder;
