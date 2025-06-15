"use client"
import { Marker } from "cobe";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const GlobeCanvas = dynamic(() => import("../components/cobe"), {
  loading: () => <p>Loading...</p>,
  ssr: false
})

declare global {
  interface Window {
    __codeCobe__?: {
      markers: Marker[]
    };
  }
}

const locationToAngles = (lat: number, long: number) => {
  console.log([Math.PI - ((long * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180])
  return [Math.PI - ((long * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180]
}

const sleep = async (time: number) => {
  return await new Promise((resolve) => setTimeout(resolve, time));
}

export default function Home() {
  const [points, setPoints] = useState<Marker[]>([])
  const [focus, setFocus] = useState<[number, number]>([0, 0])
  const [connectionText, setText] = useState("Connecting")

  useEffect(() => {
    const fetchLocation = async () => {
      const res = await fetch("/api/location");
      const geo = await res.json();
      setPoints([...points, {location: [geo.lat, geo.long], size: 0.03, color: [0, 1, 0]} as Marker])
      await sleep(1000)
      const angles = locationToAngles(geo.lat, geo.long) as [number, number]
      setFocus(angles)
    };
    fetchLocation();
    
    const animateGlobe = async () => {
      await sleep(5000)
      setText("Connected")
      const angles = locationToAngles(69.6652886, 18.9068629) as [number, number]
      setFocus(angles)
    }

    animateGlobe()

  }, []);
  return (
    <div className="flex w-full h-full justify-center items-center" suppressHydrationWarning>
      <div className="absolute top-52 left-1/2 -translate-x-1/2 text-center z-10">
        <h1 className="text-4xl font-bold">{connectionText}</h1>
      </div>
      <div className="absolute w-[60%] top-3/10">
      <GlobeCanvas scale={1} markers={points} focus={focus}/>

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
        {[...Array(300)].map((_, i) => {
          const size = Math.random() * 0.7 + 0.3; // Smaller stars: 0.3px to 1px
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
            boxShadow: `0 0 ${size * 2}px ${size}px white`,
          }}
        />
          );
        })}
      </div>
    </div>
  );
}
