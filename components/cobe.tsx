"use client";

import createGlobe from "cobe";
import { useParams } from "next/navigation";
import { useRef, useEffect } from "react";


export const locationToAngles = (lat: number, long: number) => {
  return [Math.PI - ((long * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180]
}


export default function GlobeCanvas({ scale }: {scale: number}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const focusRef = useRef([0, 0])
  useEffect(() => {

    if(!canvasRef.current) return;

    let width = 0;
    let currentPhi = 0;
    let currentTheta = 0;
    const doublePi = Math.PI * 2;
    const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth)
    window.addEventListener('resize', onResize)
    onResize()
    // Export globe instance via ref for external access
    // You can use a ref or callback to expose the globe instance
    // Here, we attach it to the window for quick prototyping (not recommended for production)
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      scale: typeof scale === "number" && !isNaN(scale) ? scale : 1,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [

      ],
      onRender: (state) => {
      state.phi = currentPhi
      state.theta = currentTheta
      const [focusPhi, focusTheta] = focusRef.current
      const distPositive = (focusPhi - currentPhi + doublePi) % doublePi
      const distNegative = (currentPhi - focusPhi + doublePi) % doublePi
      // Control the speed
      if (distPositive < distNegative) {
        currentPhi += distPositive * 0.08
      } else {
        currentPhi -= distNegative * 0.08
      }
      currentTheta = currentTheta * 0.92 + focusTheta * 0.08
      state.width = width * 2
      state.height = width * 2
      }
    });

    // Export globe instance for external use (example: attach to window)
    (window as any).__cobeGlobe__ = globe;
    
    setTimeout(() => {
      if(!canvasRef.current) return;
      canvasRef.current.style.opacity = '1'
    })
    return () => { 
      globe.destroy();
      window.removeEventListener('resize', onResize);
    }
  }, [])

return <div style={{
    width: '100%',
    aspectRatio: 1,
    margin: 'auto',
    position: 'relative',
  }}>
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        contain: 'layout paint size',
        opacity: 0,
        transition: 'opacity 1s ease',
      }}
    />
  </div>
}
