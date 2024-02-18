import { FunctionComponent, useEffect, useRef, useState } from "react";

import ReactMapGL, {
    Marker,
    NavigationControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface ViewportProps {
    height?: number;
    viewport : {
        latitude: number;
        longitude: number;
        zoom: number;
    }
}


const Mapview: FunctionComponent<ViewportProps> = ({viewport, height}) => {
    const [viewports, setViwPorts] = useState< { latitude: number; longitude: number; zoom: number; } >(viewport)
    const mapRef = useRef(null);

    useEffect(() => {
        if (viewport) {
            setViwPorts(viewport)
        }
    }, [viewport])

    return (
        <div
            style={{
                height: height ? height : 300,
                position: "relative",
            }}
            id="map"
            key={1000}
        >
            <ReactMapGL
                ref={mapRef}
                mapboxAccessToken="pk.eyJ1IjoibWF4aW1hbjgxIiwiYSI6ImNrZXBuaGE3ZTA0NXMycHI2NWoxcGx1cjEifQ.YIL3v3KgW2cmLB9e5lS_rA"
                mapStyle="mapbox://styles/mapbox/streets-v11"
                {...viewports}

            >
                    <Marker
                        latitude={viewports.latitude}
                        longitude={viewports.longitude}
                        color="#009e7f"
                    />

                <NavigationControl position="bottom-right" />

            </ReactMapGL>
        </div>
    );
};

export default Mapview;
