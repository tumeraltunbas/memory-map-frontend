import React, { useEffect, useRef } from "react";
import mapboxgl, { type MapOptions } from "mapbox-gl";

const accessToken: string = import.meta.env.VITE_MAP_BOX_ACCESS_KEY;

export const Map = () => {
  const isDevelopment: boolean =
    import.meta.env.VITE_NODE_ENV === "development" ? true : false;

  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const options: MapOptions = {
      container: mapRef.current,
      accessToken: accessToken,
    };

    if (isDevelopment) {
      options["style"] =
        "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
    } else {
      options["config"] = {
        basemap: {
          lightPreset: "night",
          showRoadLabels: false,
          font: "Inter",
        },
      };
    }

    const map = new mapboxgl.Map(options);

    return () => map.remove();
  }, []);

  return <div ref={mapRef} className="h-screen w-screen"></div>;
};
