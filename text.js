// text.js
function createTextShape(x, y, text) {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    type: 'text',
    x, y,
    text: text || 'Text',
    fontSize: 16,
    fontFamily: 'Verdana',
    isBold: false,
    isItalic: false,
    align: 'center',
    zIndex: state.zIndexCounter++
  };
}

function createDynamicTextEditor(x, y, initialText = '', fontSize = 16, fontFamily = 'Verdana', isBold = false, isItalic = false) {
  // Remove any existing editor
  const existingEditor = document.getElementById('dynamic-text-editor');
  if (existingEditor) {
    document.body.removeChild(existingEditor);
  }

  const offsetX = Math.floor(canvas.width / 2) + panOffsetX;
  const offsetY = Math.floor(canvas.height / 2) + panOffsetY;

  const pX = offsetX + x * zoomLevel;
  const pY = offsetY + y * zoomLevel - (fontSize * zoomLevel / 2);

  const editor = document.createElement('div');
  editor.id = 'dynamic-text-editor-container';
  editor.style.cssText = `
    position: absolute;
    left: ${pX}px;
    top: ${pY}px;
    min-width: 20px;
    min-height: ${fontSize * zoomLevel}px;
    padding: 0;
    background: transparent;
    z-index: 1000;
    display: inline-block;
  `;

  const textArea = document.createElement('textarea');
  textArea.id = 'dynamic-text-editor';
  textArea.value = initialText;
  textArea.style.cssText = `
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    background: transparent;
    border: 1px dashed #0066ff;
    font-size: ${fontSize * zoomLevel}px;
    font-family: ${fontFamily};
    font-weight: ${isBold ? 'bold' : 'normal'};
    font-style: ${isItalic ? 'italic' : 'normal'};
    text-align: ${state.textTarget !== 'new' && typeof state.textTarget === 'number' ? state.shapes[state.textTarget].align : 'center'};
    overflow: hidden;
    resize: none;
    outline: none;
    white-space: pre;
    line-height: 1.2;
  `;

  editor.appendChild(textArea);
  document.body.appendChild(editor);
  
  // Force initial size to be minimal
  editor.style.width = '20px';
  editor.style.height = `${fontSize * zoomLevel}px`;
  
  // Auto-resize as user types
  textArea.addEventListener('input', () => {
    // Create a hidden div to measure text size
    const measurer = document.createElement('div');
    measurer.style.cssText = `
      position: absolute;
      visibility: hidden;
      height: auto;
      width: auto;
      white-space: pre;
      font-size: ${fontSize * zoomLevel}px;
      font-family: ${fontFamily};
      font-weight: ${isBold ? 'bold' : 'normal'};
      font-style: ${isItalic ? 'italic' : 'normal'};
      line-height: 1.2;
      padding: 0;
    `;
    measurer.textContent = textArea.value || ' '; // Use at least one space to get minimum width
    document.body.appendChild(measurer);
    
    // Get dimensions and add padding
    const width = Math.max(20, measurer.offsetWidth + 10);
    const lines = (textArea.value.match(/\n/g) || []).length + 1;
    const height = Math.max(fontSize * zoomLevel, lines * fontSize * zoomLevel * 1.2);
    
    // Update the editor size
    editor.style.width = `${width}px`;
    editor.style.height = `${height}px`;
    
    // Clean up
    document.body.removeChild(measurer);
  });

  // Only save on Enter
  textArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveTextEdit(textArea, editor);
    } else if (e.key === 'Escape') {
      document.body.removeChild(editor);
      state.isEditingText = false;
      updateStatus();
    }
  });

  // Show a status message about how to finalize
  const statusMsg = document.createElement('div');
  statusMsg.id = 'text-editor-status';
  statusMsg.style.cssText = `
    position: absolute;
    bottom: -20px;
    left: 0;
    font-size: 10px;
    color: #555;
    white-space: nowrap;
  `;
  statusMsg.textContent = 'Press Shift+Enter for new line or Esc to cancel';
  editor.appendChild(statusMsg);

  textArea.focus();
  
  // Trigger initial resize
  const inputEvent = new Event('input');
  textArea.dispatchEvent(inputEvent);

  return { editor, textArea };
}

function saveTextEdit(textArea, editorContainer) {
  const text = textArea.value;
  if (text) {
    if (state.textTarget === 'new') {
      state.shapes.push(createTextShape(cursorX, cursorY, text));
    } else if (typeof state.textTarget === 'number') {
      state.shapes[state.textTarget].text = text;
    } else if (state.selectedShapeIndex !== -1 && state.textTarget === 'label') {
      const selected = state.shapes[state.selectedShapeIndex];
      state.shapes.push({
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        type: 'label',
        parentId: selected.id,
        x: selected.x,
        y: selected.y + 1,
        text,
        fontSize: 14,
        fontFamily: 'Verdana',
        isBold: false,
        isItalic: false,
        align: 'center',
        zIndex: state.zIndexCounter++
      });
    }
  }
  
  document.body.removeChild(editorContainer);
  state.isEditingText = false;
  updateStatus();
  draw();
}

// Replace the modal creation function with the dynamic editor function
function handleTextTool() {
  if (state.selectedTool === 'text') {
    state.isEditingText = true;
    state.textTarget = 'new';
    createDynamicTextEditor(cursorX, cursorY);
    updateStatus();
  }
}

// Modify the edit text function
function editTextShape(index) {
  state.isEditingText = true;
  state.textTarget = index;
  const shape = state.shapes[index];
  createDynamicTextEditor(
    shape.x, 
    shape.y, 
    shape.text, 
    shape.fontSize, 
    shape.fontFamily, 
    shape.isBold, 
    shape.isItalic
  );
  updateStatus();
}

function drawText(x, y, text, fontSize, fontFamily, isBold, isItalic, align, isSelected) {
  const offsetX = Math.floor(canvas.width / 2) + panOffsetX;
  const offsetY = Math.floor(canvas.height / 2) + panOffsetY;

  const pX = offsetX + x * zoomLevel;
  const pY = offsetY + y * zoomLevel;

  let fontString = '';
  if (isItalic) fontString += 'italic ';
  if (isBold) fontString += 'bold ';
  fontString += `${fontSize * zoomLevel}px ${fontFamily}`;

  ctx.font = fontString;
  ctx.textAlign = align;
  ctx.fillStyle = isSelected ? '#0066ff' : 'black';
  
  // Split text by newlines and draw each line
  const lines = text.split('\n');
  const lineHeight = fontSize * zoomLevel * 1.2; // 1.2 is a common line-height multiplier
  
  let textWidth = 0;
  for (let i = 0; i < lines.length; i++) {
    const lineY = pY + (i * lineHeight);
    ctx.fillText(lines[i], pX, lineY);
    
    const metrics = ctx.measureText(lines[i]);
    textWidth = Math.max(textWidth, metrics.width);
  }

  if (isSelected) {
    const textHeight = lineHeight * lines.length;
    
    ctx.strokeStyle = '#0066ff';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.strokeRect(
      pX - (align === 'center' ? textWidth / 2 : 0) - 5,
      pY - fontSize * zoomLevel + 3,
      textWidth + 10,
      textHeight + 5
    );
    ctx.setLineDash([]);
  }
}
