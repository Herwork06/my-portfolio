"use client";
import { useRef, useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import * as THREE from "three";

// Disable SSR for react-globe.gl
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function GlobeDots() {
  const globeRef = useRef<any>(null);
  const [countries, setCountries] = useState({ features: [] });

  // Fetch geo data
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/vasturiano/react-globe.gl/refs/heads/master/example/datasets/ne_110m_admin_0_countries.geojson"
    )
      .then((res) => res.json())
      .then(setCountries);
  }, []);

const radialGlowMaterial = useMemo(() => {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color("#ffffff") }
    },
    vertexShader: `
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vPosition;
      uniform vec3 uColor;

      void main() {
        float intensity = + 0.1 - length(vPosition);   // center = 1, edge = 0
        intensity = pow(intensity, 2.5);              // shape the curve
        vec3 color = mix(vec3(0.0), uColor, intensity); // black center fade
        gl_FragColor = vec4(color, 1.0);              // fully opaque
      }
    `,
    transparent: false,
    depthWrite: true,
  });
}, []);



  return (

        <Globe
          ref={globeRef}
          backgroundColor="#000000"
          showAtmosphere={true}
          atmosphereColor="#ffffff"
          atmosphereAltitude={0.2}
          hexPolygonsData={countries.features}
          hexPolygonResolution={3}
          hexPolygonMargin={0.4}
          hexPolygonUseDots={true}
          hexPolygonColor={() => "#ffffff"}
          globeMaterial={radialGlowMaterial}
          
        />


  );
}
