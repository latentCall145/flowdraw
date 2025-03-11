// export.js
function exportToPNG() {
  // Create a temporary canvas to draw without the cursor and grid
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  
  // Fill with white background
  tempCtx.fillStyle = 'white';
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  
  // Get the sorted shapes
  const sortedShapes = [...state.shapes].sort((a, b) => a.zIndex - b.zIndex);
  
  // Draw all shapes without selection highlights
  sortedShapes.forEach(shape => {
    if (shape.type === 'rectangle') {
      drawExportRectangle(tempCtx, shape.x1, shape.y1, shape.x2, shape.y2);
    } else if (shape.type === 'line') {
      drawExportLine(tempCtx, shape.x1, shape.y1, shape.x2, shape.y2, shape.arrowStyle);
    } else if (shape.type === 'text' || shape.type === 'label') {
      drawExportText(
        tempCtx,
        shape.x, shape.y,
        shape.text,
        shape.fontSize,
        shape.fontFamily,
        shape.isBold,
        shape.isItalic,
        shape.align
      );
    }
  });
  
  // Create download link
  const link = document.createElement('a');
  link.download = 'whiteboard-' + new Date().toISOString().slice(0, 19).replace(/:/g, '-') + '.png';
  
  // Convert canvas to blob and trigger download
  tempCanvas.toBlob(function(blob) {
    link.href = URL.createObjectURL(blob);
    link.click();
    
    // Show status message
    const oldStatusText = statusEl.textContent;
    statusEl.textContent = 'Exported to PNG!';
    setTimeout(() => {
      statusEl.textContent = oldStatusText;
    }, 2000);
  });
}

// Drawing functions for export (without grid and cursor)
function drawExportRectangle(ctx, x1, y1, x2, y2) {
  const offsetX = Math.floor(canvas.width / 2);
  const offsetY = Math.floor(canvas.height / 2);

  const pX1 = offsetX + x1;
  const pY1 = offsetY + y1;
  const pX2 = offsetX + x2;
  const pY2 = offsetY + y2;

  const width = pX2 - pX1;
  const height = pY2 - pY1;

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.strokeRect(pX1, pY1, width, height);
}

function drawExportLine(ctx, x1, y1, x2, y2, arrowStyle = 'none') {
  const offsetX = Math.floor(canvas.width / 2);
  const offsetY = Math.floor(canvas.height / 2);

  const pX1 = offsetX + x1;
  const pY1 = offsetY + y1;
  const pX2 = offsetX + x2;
  const pY2 = offsetY + y2;

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pX1, pY1);
  ctx.lineTo(pX2, pY2);
  ctx.stroke();

  if (arrowStyle === 'end' || arrowStyle === 'both') {
    drawExportArrowhead(ctx, pX2, pY2, pX1, pY1);
  }
  if (arrowStyle === 'both') {
    drawExportArrowhead(ctx, pX1, pY1, pX2, pY2);
  }
}

function drawExportArrowhead(ctx, x, y, fromX, fromY) {
  const headLen = 15;
  const angle = Math.atan2(y - fromY, x - fromX);

  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(
    x - headLen * Math.cos(angle - Math.PI / 6),
    y - headLen * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    x - headLen * Math.cos(angle + Math.PI / 6),
    y - headLen * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();
}

function drawExportText(ctx, x, y, text, fontSize, fontFamily, isBold, isItalic, align) {
  const offsetX = Math.floor(canvas.width / 2);
  const offsetY = Math.floor(canvas.height / 2);

  const pX = offsetX + x;
  const pY = offsetY + y;

  let fontString = '';
  if (isItalic) fontString += 'italic ';
  if (isBold) fontString += 'bold ';
  fontString += `${fontSize}px ${fontFamily}`;

  ctx.font = fontString;
  ctx.textAlign = align;
  ctx.fillStyle = 'black';
  ctx.fillText(text, pX, pY);
}
