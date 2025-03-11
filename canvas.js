// canvas.js
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');
let gridSize = 80;
let cursorX = 0;
let cursorY = 0;
let zoomLevel = 1;
let panOffsetX = 0;
let panOffsetY = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
}

// Update the drawGrid function in canvas.js
function drawGrid() {
  const offsetX = Math.floor(canvas.width / 2) + panOffsetX;
  const offsetY = Math.floor(canvas.height / 2) + panOffsetY;

  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 1;

  // Calculate grid spacing with zoom applied
  const scaledGridSize = gridSize * zoomLevel;

  // Calculate where to start drawing grid lines
  const startX = offsetX % scaledGridSize;
  const startY = offsetY % scaledGridSize;

  for (let x = startX; x < canvas.width; x += scaledGridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = startY; y < canvas.height; y += scaledGridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function drawCursor() {
  const offsetX = Math.floor(canvas.width / 2) + panOffsetX;
  const offsetY = Math.floor(canvas.height / 2) + panOffsetY;
  const cursorPosX = offsetX + cursorX * zoomLevel;
  const cursorPosY = offsetY + cursorY * zoomLevel;

  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(cursorPosX, cursorPosY, 5, 0, Math.PI * 2);
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  /*const sortedShapes = [...state.shapes].sort((a, b) => a.zIndex - b.zIndex);
  sortedShapes.forEach((shape, index) => {
    const isSelected = index === state.selectedShapeIndex;
    if (shape.type === 'rectangle') {
      drawRectangle(shape.x1, shape.y1, shape.x2, shape.y2, isSelected);
    } else if (shape.type === 'line') {
      drawLine(shape.x1, shape.y1, shape.x2, shape.y2, shape.arrowStyle, isSelected);
    } else if (shape.type === 'text' || shape.type === 'label') {
      drawText(
        shape.x, shape.y,
        shape.text,
        shape.fontSize,
        shape.fontFamily,
        shape.isBold,
        shape.isItalic,
        shape.align,
        isSelected
      );
    }
  });*/
  // Draw shapes (sorted by zIndex)
  const sortedShapes = [...state.shapes].sort((a, b) => a.zIndex - b.zIndex);
  
  for (let i = 0; i < sortedShapes.length; i++) {
    const shape = sortedShapes[i];
    //const originalIndex = state.shapes.indexOf(shape);
    const isSelected = state.selectedShapeIndex === i || 
                        state.selectedShapeIndices.includes(i);
    
    // Draw the shape with appropriate styling
    if (shape.type === 'rectangle') {
      drawRectangle(shape.x1, shape.y1, shape.x2, shape.y2, isSelected);
    } else if (shape.type === 'line') {
      console.log(shape.x1 + " " +  shape.y1);
      drawLine(shape.x1, shape.y1, shape.x2, shape.y2, shape.arrowStyle, isSelected);
    } else if (shape.type === 'text' || shape.type === 'label') {
      console.log(shape);
      drawText(
        shape.x, shape.y,
        shape.text,
        shape.fontSize,
        shape.fontFamily,
        shape.isBold,
        shape.isItalic,
        shape.align,
        isSelected
      );
    }
  }

  if (state.tempShape) {
    if (state.tempShape.type === 'rectangle') {
      drawRectangle(state.tempShape.x1, state.tempShape.y1, cursorX, cursorY);
    } else if (state.tempShape.type === 'line') {
      drawLine(state.tempShape.x1, state.tempShape.y1, cursorX, cursorY, state.tempShape.arrowStyle);
    }
  }

  // Draw selection box if in multi-select mode
  if (state.selectionBox && state.multiSelectMode) {
    ctx.save();
    
    // Set color based on selection direction
    if (state.selectionDirection === 'left-to-right') {
      ctx.strokeStyle = 'blue';
      ctx.fillStyle = 'rgba(0, 0, 255, 0.1)';
    } else {
      ctx.strokeStyle = 'green';
      ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
    }
    
    ctx.lineWidth = 1;
    
    const x = Math.min(state.selectionBox.x1, state.selectionBox.x2);
    const y = Math.min(state.selectionBox.y1, state.selectionBox.y2);
    const width = Math.abs(state.selectionBox.x2 - state.selectionBox.x1);
    const height = Math.abs(state.selectionBox.y2 - state.selectionBox.y1);
    
    ctx.fillRect(x, y, width, height);
    ctx.strokeRect(x, y, width, height);
    
    ctx.restore();
  }

  drawCursor();
}
