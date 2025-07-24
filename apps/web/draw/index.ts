type Shape =
    | {
          x: number;
          y: number;
          width: number;
          height: number;
          type: "rectangle";
      }
    | {
          type: "circle";
          centerX: number;
          centerY: number;
          radius: number;
      };
export function initDraw(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    let existingShapes: Shape[] = [];
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

        let width = event.offsetX - startX;
        let height = event.offsetY - startY;
        clearCanvas(canvas, existingShapes, ctx);  

        ctx.strokeStyle = "black";
        ctx.strokeRect(startX, startY, width, height);
    });

    canvas.addEventListener("mouseup", (event) => {
        isDrawing = false;
        let width = event.offsetX - startX;
        let height = event.offsetY - startY;
        existingShapes.push({
            x: startX,
            y: startY,
            width: width,
            height: height,
            type: "rectangle"
        })
    });
}
const clearCanvas = (canvas: HTMLCanvasElement, existingShapes:Shape[], ctx:CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    existingShapes.forEach(shape => {
        if (shape.type === "rectangle") {
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } 
    })
}
