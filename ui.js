// ui.js
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
