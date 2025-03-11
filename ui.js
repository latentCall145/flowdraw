// ui.js
/*
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
*/
function updateStatus() {
  let modeText = 'Navigate';
  
  if (state.mode === 'rectangle-start') {
    modeText = 'Rectangle: Select First Point';
  } else if (state.mode === 'rectangle-end') {
    modeText = 'Rectangle: Select Second Point';
  } else if (state.mode === 'line-start') {
    modeText = 'Line: Select First Point';
  } else if (state.mode === 'line-end') {
    modeText = 'Line: Select Second Point';
  } else if (state.mode === 'multi-select') {
    modeText = state.selectionDirection === 'left-to-right' ? 
      'Multi-Select (Fully Enclosed)' : 'Multi-Select (Partially Enclosed)';
  }
  
  const selectedCount = state.multiSelectMode ? 
    state.selectedShapeIndices.length : 
    (state.selectedShapeIndex !== -1 ? 1 : 0);
  
  const selectionText = selectedCount > 0 ? ` | Selected: ${selectedCount}` : '';
  
  statusEl.textContent = `Grid Size: ${gridSize} | Mode: ${modeText}${selectionText}`;
}
