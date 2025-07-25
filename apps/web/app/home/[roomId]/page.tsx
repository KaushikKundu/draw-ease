"use client"
import { initDraw } from "@/draw/index";
import { useEffect, useRef, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ArrowRight, Circle, Eraser, Square } from "lucide-react";

export const enum ShapeName {
  Circle,
  Rectangle,
  Line,
  Eraser
}
function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [curShape, setCurShape] = useState<ShapeName | null>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const cleanup = initDraw(canvasRef.current, curShape);
      return cleanup;
    }
  }, [curShape]);
  useEffect(() => {
    setCanvasSize({
      width: window.innerWidth,
      height: window.innerHeight
    })
  },[])
  console.log(curShape);
  return (
    <div>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white p-2 rounded-xl border shadow flex">
        <ToggleGroup type="single">
          <ToggleGroupItem value="rectangle" onClick={() => setCurShape(ShapeName.Rectangle)}><Square /> </ToggleGroupItem>
          <ToggleGroupItem value="circle" onClick={() => setCurShape(ShapeName.Circle)}><Circle /></ToggleGroupItem>
          <ToggleGroupItem value="Line" onClick={() => setCurShape(ShapeName.Line)}><ArrowRight /></ToggleGroupItem>
          <ToggleGroupItem value="eraser" onClick={() => setCurShape(ShapeName.Eraser)}><Eraser /></ToggleGroupItem>
        </ToggleGroup>
      </div>
      <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height} className="bg-gray-100"></canvas>
    </div>
  );
}
export default Home;