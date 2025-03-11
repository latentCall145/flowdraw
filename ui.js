// ui.js
function updateStatus() {
  let modeText = state.mode.charAt(0).toUpperCase() + state.mode.slice(1);
  let statusText = `Grid Size: ${gridSize} | Mode: ${modeText}`;

  if (state.isEditingText) {
    statusText += ' | Editing Text';
  } else if (state.selectedShapeIndex !== -1) {
    const shape = state.shapes[state.selectedShapeIndex];
    statusText += ` | Selected: ${shape.type}`;

    if (shape.type === 'text' || shape.type === 'label') {
      statusText += ` | Text: "${shape.text.substring(0, 15)}${shape.text.length > 15 ? '...' : ''}"`;
    }
  }

  statusEl.textContent = statusText;
}
