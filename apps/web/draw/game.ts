import { start } from "node:repl";

export function initDraw(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("Failed to get canvas context");
    }

    let startX = 0;
    let startY = 0;
    let isDrawing = false;
    canvas.addEventListener("mousedown", (event) => {
        startX = event.offsetX;
        startY = event.offsetY;
        isDrawing = true;
    });

    canvas.addEventListener("mousemove", (event) => {
        if (!isDrawing) return;

        let width = event.offsetX - startX ;
        let height = event.offsetY - startY;

        ctx.clearRect(0,0,canvas.width,canvas.height);
     
        ctx.strokeStyle = "black";
        ctx.strokeRect(startX, startY, width, height )
    });

    canvas.addEventListener("mouseup", () => {
        isDrawing = false;
    });
}
