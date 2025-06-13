"use client"
import GlobeCanvas, { locationToAngles } from "@/components/cobe";
import { Marker } from "cobe";
import { useEffect } from "react";

declare global {
  interface Window {
    __codeCobe__?: {
      markers: Marker[]
    };
  }
}

  const fetchLocation = async () => {
    const res = await fetch("/api/location");
    const geo = await res.json();
    if (window.__codeCobe__?.markers) {
      window.__codeCobe__.markers.push({location: [geo.lat, geo.long], size: 0.1})
    }
    locationToAngles(geo.lat, geo.long)
  };
export default function Home() {
  useEffect(() => {

    fetchLocation();
    
  }, []);
  return (
    <div className="flex w-full h-full justify-center items-center">
      <div className="absolute w-[60%] top-3/10">
      <GlobeCanvas scale={1} />

      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: -1,
          overflow: "hidden",
        }}
      >
        {[...Array(100)].map((_, i) => {
          const size = Math.random() * 2 + 1;
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const opacity = Math.random() * 0.5 + 0.5;
          return (
        <div
          key={i}
          style={{
            position: "absolute",
            top: `${top}vh`,
            left: `${left}vw`,
            width: size,
            height: size,
            borderRadius: "50%",
            background: "white",
            opacity,
            boxShadow: `0 0 ${size * 1}px ${size}px white`,
          }}
        />
          );
        })}
      </div>
    </div>
  );
}
