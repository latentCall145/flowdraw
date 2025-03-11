// shapes.js
function drawRectangle(x1, y1, x2, y2, isSelected = false) {
  const offsetX = Math.floor(canvas.width / 2) + panOffsetX;
  const offsetY = Math.floor(canvas.height / 2) + panOffsetY;

  const pX1 = offsetX + x1 * zoomLevel;
  const pY1 = offsetY + y1 * zoomLevel;
  const pX2 = offsetX + x2 * zoomLevel;
  const pY2 = offsetY + y2 * zoomLevel;

  const width = pX2 - pX1;
  const height = pY2 - pY1;

  ctx.strokeStyle = isSelected ? '#0066ff' : 'black';
  ctx.lineWidth = 2;
  ctx.strokeRect(pX1, pY1, width, height);
}

function drawLine(x1, y1, x2, y2, arrowStyle = 'none', isSelected = false) {
  const offsetX = Math.floor(canvas.width / 2) + panOffsetX;
  const offsetY = Math.floor(canvas.height / 2) + panOffsetY;

  const pX1 = offsetX + x1 * zoomLevel;
  const pY1 = offsetY + y1 * zoomLevel;
  const pX2 = offsetX + x2 * zoomLevel;
  const pY2 = offsetY + y2 * zoomLevel;

  ctx.strokeStyle = isSelected ? '#0066ff' : 'black';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pX1, pY1);
  ctx.lineTo(pX2, pY2);
  ctx.stroke();

  if (arrowStyle === 'end' || arrowStyle === 'both') {
    drawArrowhead(pX2, pY2, pX1, pY1);
  }
  if (arrowStyle === 'both') {
    drawArrowhead(pX1, pY1, pX2, pY2);
  }
}

function drawArrowhead(x, y, fromX, fromY) {
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
