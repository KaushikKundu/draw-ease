import { ShapeName } from "@/app/home/[roomId]/page";
type Shape =
    | {
          type: ShapeName.Rectangle;
          x: number;
          y: number;
          width: number;
          height: number;
      }
    | {
          type: ShapeName.Circle;
          centerX: number;
          centerY: number;
          radius: number;
      }
    | {
          type: ShapeName.Line;
          startX: number;
          startY: number;
          endX: number;
          endY: number;
      }
    | {
          type: ShapeName.Eraser;
          x: number;
          y: number;
      };
export function initDraw(canvas: HTMLCanvasElement, curShape: ShapeName) {
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
        if (curShape === ShapeName.Rectangle) {
            ctx.strokeRect(startX, startY, width, height);
        } else if (curShape === ShapeName.Circle) {
            const radius = Math.sqrt(width * width + height * height);
            ctx.beginPath();
            ctx.arc(startX, startY, radius, 0, Math.PI * 2);
            ctx.stroke();
        } else if (curShape === ShapeName.Line) {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(event.offsetX, event.offsetY);
            ctx.stroke();
        }
    });

    canvas.addEventListener("mouseup", (event) => {
        isDrawing = false;
        let width = event.offsetX - startX;
        let height = event.offsetY - startY;
        if (curShape === ShapeName.Circle) {
            const radius = Math.sqrt(width * width + height * height);
            existingShapes.push({
                centerX: startX,
                centerY: startY,
                radius: radius,
                type: ShapeName.Circle,
            });
        } else if (curShape === ShapeName.Rectangle) {
            existingShapes.push({
                x: startX,
                y: startY,
                width: width,
                height: height,
                type: ShapeName.Rectangle,
            });
        } else if (curShape === ShapeName.Line) {
            existingShapes.push({
                startX: startX,
                startY: startY,
                endX: event.offsetX,
                endY: event.offsetY,
                type: ShapeName.Line,
            });
        }
        // Add logic for Eraser if needed in the future
    });
}
const clearCanvas = (
    canvas: HTMLCanvasElement,
    existingShapes: Shape[],
    ctx: CanvasRenderingContext2D
) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    existingShapes.forEach((shape) => {
        if (shape.type === ShapeName.Rectangle) {
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === ShapeName.Circle) {
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
            ctx.stroke();
        } else if (shape.type === ShapeName.Line) {
            ctx.beginPath();
            ctx.moveTo(shape.startX, shape.startY);
            ctx.lineTo(shape.endX, shape.endY);
            ctx.stroke();
        }
    });
};
