// select.js
function isPointInRectangle(x, y, rect) {
  const offsetX = Math.floor(canvas.width / 2);
  const offsetY = Math.floor(canvas.height / 2);
  
  const pX = offsetX + x * gridSize;
  const pY = offsetY + y * gridSize;
  
  const x1 = offsetX + rect.x1 * gridSize;
  const y1 = offsetY + rect.y1 * gridSize;
  const x2 = offsetX + rect.x2 * gridSize;
  const y2 = offsetY + rect.y2 * gridSize;
  
  // Use min/max to handle cases where x1 > x2 or y1 > y2
  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  
  return pX >= minX && pX <= maxX && pY >= minY && pY <= maxY;
}

function isPointNearLine(x, y, line) {
  const offsetX = Math.floor(canvas.width / 2);
  const offsetY = Math.floor(canvas.height / 2);
  
  const pX = offsetX + x * gridSize;
  const pY = offsetY + y * gridSize;
  
  const x1 = offsetX + line.x1 * gridSize;
  const y1 = offsetY + line.y1 * gridSize;
  const x2 = offsetX + line.x2 * gridSize;
  const y2 = offsetY + line.y2 * gridSize;
  
  // Calculate distance from point to line
  const A = pX - x1;
  const B = pY - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  
  const dot = A * C + B * D;
  const len_sq = C * C + D * D;
  let param = -1;
  
  if (len_sq != 0) param = dot / len_sq;
  
  let xx, yy;
  
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }
  
  const dx = pX - xx;
  const dy = pY - yy;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Consider the line selected if cursor is within 10 pixels
  return distance < 10;
}

function isPointInText(x, y, textShape) {
  const offsetX = Math.floor(canvas.width / 2);
  const offsetY = Math.floor(canvas.height / 2);
  
  const pX = offsetX + x;
  const pY = offsetY + y;
  
  const textX = offsetX + textShape.x;
  const textY = offsetY + textShape.y;
  
  // Use the text metrics to determine text dimensions
  ctx.font = `${textShape.isBold ? 'bold ' : ''}${textShape.isItalic ? 'italic ' : ''}${textShape.fontSize}px ${textShape.fontFamily}`;
  const metrics = ctx.measureText(textShape.text);
  const textWidth = metrics.width;
  const textHeight = textShape.fontSize;
  
  // Calculate text box based on alignment
  let textLeft;
  if (textShape.align === 'center') {
    textLeft = textX - textWidth / 2;
  } else if (textShape.align === 'right') {
    textLeft = textX - textWidth;
  } else {
    textLeft = textX;
  }
  
  // Check if point is within the text box
  return (
    pX >= textLeft - 5 &&
    pX <= textLeft + textWidth + 5 &&
    pY >= textY - textHeight - 5 &&
    pY <= textY + 5
  );
}

// Helper functions to determine if shapes are enclosed
function isRectangleFullyEnclosed(rect, selBox) {
  return (
    rect.x1 >= selBox.x1 && rect.x2 <= selBox.x2 &&
    rect.y1 >= selBox.y1 && rect.y2 <= selBox.y2
  );
}

function isRectanglePartiallyEnclosed(rect, selBox) {
  // Check if any part of the rectangle is inside the selection box
  return !(
    rect.x2 < selBox.x1 || rect.x1 > selBox.x2 ||
    rect.y2 < selBox.y1 || rect.y1 > selBox.y2
  );
}

function isLineFullyEnclosed(line, selBox) {
  return (
    line.x1 >= selBox.x1 && line.x1 <= selBox.x2 &&
    line.y1 >= selBox.y1 && line.y1 <= selBox.y2 &&
    line.x2 >= selBox.x1 && line.x2 <= selBox.x2 &&
    line.y2 >= selBox.y1 && line.y2 <= selBox.y2
  );
}

function isLinePartiallyEnclosed(line, selBox) {
  // Check if either endpoint is in the box or if the line crosses the box
  const isEndpoint1Inside = (
    line.x1 >= selBox.x1 && line.x1 <= selBox.x2 &&
    line.y1 >= selBox.y1 && line.y1 <= selBox.y2
  );
  
  const isEndpoint2Inside = (
    line.x2 >= selBox.x1 && line.x2 <= selBox.x2 &&
    line.y2 >= selBox.y1 && line.y2 <= selBox.y2
  );
  
  // Check if line crosses any of the selection box edges
  const lineIntersectsBox = (
    lineIntersectsSegment(line.x1, line.y1, line.x2, line.y2, selBox.x1, selBox.y1, selBox.x2, selBox.y1) ||
    lineIntersectsSegment(line.x1, line.y1, line.x2, line.y2, selBox.x2, selBox.y1, selBox.x2, selBox.y2) ||
    lineIntersectsSegment(line.x1, line.y1, line.x2, line.y2, selBox.x1, selBox.y2, selBox.x2, selBox.y2) ||
    lineIntersectsSegment(line.x1, line.y1, line.x2, line.y2, selBox.x1, selBox.y1, selBox.x1, selBox.y2)
  );
  
  return isEndpoint1Inside || isEndpoint2Inside || lineIntersectsBox;
}

function lineIntersectsSegment(x1, y1, x2, y2, x3, y3, x4, y4) {
  // Check if two line segments intersect
  const d = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (d === 0) return false;
  
  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / d;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / d;
  
  return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
}

function isTextFullyEnclosed(text, selBox) {
  // Assuming text has x, y coordinates for the top-left corner
  // and approximate width and height (you may need to adjust this)
  const textWidth = text.text.length * 8; // Approximation
  const textHeight = 16; // Approximation
  
  return (
    text.x >= selBox.x1 && text.x + textWidth <= selBox.x2 &&
    text.y >= selBox.y1 && text.y + textHeight <= selBox.y2
  );
}

function isTextPartiallyEnclosed(text, selBox) {
  const textWidth = text.text.length * 8; // Approximation
  const textHeight = 16; // Approximation
  
  return !(
    text.x + textWidth < selBox.x1 || text.x > selBox.x2 ||
    text.y + textHeight < selBox.y1 || text.y > selBox.y2
  );
}
