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
  const size = 5;
  
  // red crosshairs
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cursorPosX - size, cursorPosY);
  ctx.lineTo(cursorPosX + size, cursorPosY);
  ctx.moveTo(cursorPosX, cursorPosY - size);
  ctx.lineTo(cursorPosX, cursorPosY + size);
  ctx.stroke();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  
  // Sort shapes by z-index for rendering
  const sortedShapes = [...state.shapes].sort((a, b) => a.zIndex - b.zIndex);
  
  // Draw all shapes
  for (const shape of sortedShapes) {
    const isSelected = state.selectedShapeIndex === state.shapes.indexOf(shape) || 
                       state.selectedShapeIndices.includes(state.shapes.indexOf(shape));
    
    if (shape.type === 'rectangle') {
      drawRectangle(shape.x1, shape.y1, shape.x2, shape.y2, isSelected);
    } else if (shape.type === 'line') {
      drawLine(shape.x1, shape.y1, shape.x2, shape.y2, shape.arrowStyle, isSelected);
    } else if (shape.type === 'text' || shape.type === 'label') {
      drawText(shape.x, shape.y, shape.text, shape.fontSize, shape.fontFamily, 
               shape.isBold, shape.isItalic, shape.align, isSelected);
    }
  }
  
  // Draw temp shapes
  if (state.tempShape) {
    if (state.tempShape.type === 'rectangle') {
      drawRectangle(state.tempShape.x1, state.tempShape.y1, cursorX, cursorY);
    } else if (state.tempShape.type === 'line') {
      drawLine(state.tempShape.x1, state.tempShape.y1, cursorX, cursorY, state.tempShape.arrowStyle);
    }
  }
  
  // Draw selection box in multi-select mode
  if (state.selectionBox) {
    ctx.beginPath();
    const offsetX = Math.floor(canvas.width / 2) + panOffsetX;
    const offsetY = Math.floor(canvas.height / 2) + panOffsetY;
    const x = offsetX + Math.min(state.selectionBox.x1, state.selectionBox.x2) * zoomLevel;
    const y = offsetY + Math.min(state.selectionBox.y1, state.selectionBox.y2) * zoomLevel;
    const width = Math.abs(state.selectionBox.x2 - state.selectionBox.x1) * zoomLevel;
    const height = Math.abs(state.selectionBox.y2 - state.selectionBox.y1) * zoomLevel;
    
    // Selection style based on direction
    if (state.selectionBox.x1 <= state.selectionBox.x2) {
      // Left-to-right, Blue, fully enclosed selection
      ctx.strokeStyle = 'rgba(0, 100, 255, 0.8)';
      ctx.fillStyle = 'rgba(0, 100, 255, 0.1)';
    } else {
      // Right-to-left, Green, partially enclosed selection
      ctx.strokeStyle = 'rgba(0, 180, 0, 0.8)';
      ctx.fillStyle = 'rgba(0, 180, 0, 0.1)';
    }
    
    ctx.lineWidth = 2;
    ctx.rect(x, y, width, height);
    ctx.fill();
    ctx.stroke();
  }
  
  drawCursor();
  
  ctx.restore();
}
