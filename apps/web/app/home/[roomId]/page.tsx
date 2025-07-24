"use client"
import { initDraw } from "@/draw/index";
import { useEffect, useRef } from "react";

function Home(){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(()=>{
        if(canvasRef.current){
           initDraw(canvasRef.current)
        }
    },[canvasRef]);
    return (
      <div>
        <canvas ref={canvasRef} width={1000} height={500} className="border-slate-900 border-2"></canvas>
      </div>
    );
}
export default Home;