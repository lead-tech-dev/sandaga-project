import { FunctionComponent, useEffect, useRef, useState } from "react";

import ReactMapGL, {
  GeolocateControl,
  Marker,
  NavigationControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Geocoder from "./Geocoder";

interface ViewportProps {
  latitude: number;
  longitude: number;
  zoom: number;
}

interface LocationProps {
  handleResult: (option: { label: string; value: any }) => void;

  handleError: (label: string) => void;
  adsData: any;
}


const token = "pk.eyJ1IjoibWF4aW1hbjgxIiwiYSI6ImNrZXBuaGE3ZTA0NXMycHI2NWoxcGx1cjEifQ.YIL3v3KgW2cmLB9e5lS_rA"

const Location: FunctionComponent<LocationProps> = ({
  handleResult,
  adsData,
  handleError,
}) => {
  const [lng, setLng] = useState<number>(0);
  const [lat, setLat] = useState<number>(0);
  const [viewport, setViewport] = useState<ViewportProps>({
    latitude: 48.856614,
    longitude: 2.3522219,
    zoom: 8,
  });

  const mapRef = useRef(null);

  useEffect(() => {

    if (Object.keys(adsData).length > 0) {

        setTimeout(() => {
          let element = document.querySelector(".mapboxgl-ctrl-geocoder--input") as HTMLInputElement;

          if (element) {

            element.value = `${adsData.address.number} ${adsData.address.street},${adsData.address.pincode} ${adsData.address.city}, ${adsData.address.country}`

          }
        }, 1000)


      setViewport((prevState) => ({...prevState, longitude:adsData.point.longitude, latitude: adsData.point.latitude}))

      // setLat(adsData.point.latitude);
    }

    // mapboxgl.accessToken =
    //   "pk.eyJ1IjoibWF4aW1hbjgxIiwiYSI6ImNrZXBuaGE3ZTA0NXMycHI2NWoxcGx1cjEifQ.YIL3v3KgW2cmLB9e5lS_rA";

    /*navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      setViewport({
        ...viewport,
        latitude,
        longitude,
        zoom: 2,
      });

      // new mapboxgl.Map({
      //   // container id specified in the HTML
      //   container: "map",

      //   // style URL
      //   style: "mapbox://styles/mapbox/light-v10",

      //   // initial position in [lon, lat] format
      //   center: [position.coords.longitude, position.coords.latitude],

      //   // initial zoom

      //   zoom: 8,
      // });

      // setLng(e.coords.longitude);
      //       setLat(e.coords.latitude);
      //       console.log(e.coords.latitude);
    });*/

    }, [adsData]);

  const handleLocationResult = (result: any) => {

    if (result.place_type[0] === "region" || result.place_type[1] === "place") {
      let place_name = result.place_name.split(",");
      handleResult({ label: "address", value: place_name[0] });
      handleResult({ label: "country", value: place_name[1] });
      handleError("location");

    } else if (result.place_type[0] === "address") {
     if (result.context.length === 4) {
       handleResult({
         label: "address",
         value: {
           number:
               result.place_name.split(",")[0].split(" ").length > 1
                   ? result.place_name.split(",")[0].split(" ")[0]
                   : "",
           street:
               result.place_name.split(",")[0].split(" ").length > 1
                   ? result.place_name.split(",")[0].split(" ").slice(1).join(" ")
                   : result.place_name.split(",")[0],
           pincode: result.context[0].text_fr,
           city: result.context[1].text_fr,
           state: result.context[2].text_fr,
           country: result.context[3].text_fr,
         },
       });
     }else {
       handleResult({
         label: "address",
         value: {
           number:
               result.place_name.split(",")[0].split(" ").length > 1
                   ? result.place_name.split(",")[0].split(" ")[0]
                   : "",
           street:
               result.place_name.split(",")[0].split(" ").length > 1
                   ? result.place_name.split(",")[0].split(" ").slice(1).join(" ")
                   : result.place_name.split(",")[0],
           pincode: result.context[0].text_fr,
           city: result.context[1].text_fr,
           country: result.context[2].text_fr,
           state: "",
         },
       });
     }
      handleResult({
        label: "point",
        value: {
          longitude: result.geometry.coordinates[0],
          latitude: result.geometry.coordinates[1],
        },
      });
      handleError("location");
    } else {
      handleResult({ label: "address", value: result.place_name });
      handleResult({ label: "country", value: result.place_name });
    }
  };

  const onSelected = (viewport: ViewportProps, item: any) => {
    setViewport(viewport);
  };

  const handleGeolocation = async (longitude: number, latitude: number) => {
    try {

      const endpoint = `https://api.tiles.mapbox.com/v4/geocode/mapbox.places-v1/${longitude},${latitude}.json?access_token=${token}`;

      const response = await fetch(endpoint);
      const results = await response.json();

     if (results.features[0].place_type[0] === "region" || results.features[0].place_type[0] === "place") {
        let place_name = results.features[0].place_name.split(",");

        handleResult({ label: "address",  value: {
            number: "",
            street: place_name[0],
            pincode: "",
            city: place_name[1] ? place_name[1] : "",
            state: "",
            country: place_name[2] ? place_name[2] : "",
          } });
      }

      handleResult({
        label: "point",
        value: {
          longitude: results.features[0].geometry.coordinates[0],
          latitude: results.features[0].geometry.coordinates[1],
        },
      });

    } catch (error: any) {
      console.log("Error fetching data: " + error.message);
    }
    setViewport((prevState) => ({...prevState, longitude:longitude, latitude: latitude}));
  }
  return (
    <div
      style={{
        height: 300,
        position: "relative",
      }}
      id="map"
      key={1000}
    >
      <ReactMapGL
        ref={mapRef}
        mapboxAccessToken="pk.eyJ1IjoibWF4aW1hbjgxIiwiYSI6ImNrZXBuaGE3ZTA0NXMycHI2NWoxcGx1cjEifQ.YIL3v3KgW2cmLB9e5lS_rA"
        initialViewState={viewport}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        {...viewport}
        // onMove={(e) => console.log(e)}
      >
        <Marker
            latitude={viewport.latitude}
            longitude={viewport.longitude}
            draggable
            onDragEnd={(e: any) => handleGeolocation(e.lngLat.lng, e.lngLat.lat)}
        />
        <NavigationControl position="bottom-right" />
        <GeolocateControl
          position="top-left"
          trackUserLocation
          onGeolocate={(e: any) => handleGeolocation(e.coords.longitude, e.coords.latitude)}
        />
        <Geocoder
          handleResult={(e) => handleLocationResult(e.result)}
          adsData={adsData}
        />
      </ReactMapGL>
    </div>
  );
};

export default Location;
