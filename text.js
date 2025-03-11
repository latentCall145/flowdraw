// text.js
function createTextShape(x, y, text) {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    type: 'text',
    x, y,
    text: text || 'Text',
    fontSize: 16,
    fontFamily: 'Arial',
    isBold: false,
    isItalic: false,
    align: 'center',
    zIndex: state.zIndexCounter++
  };
}

function createTextInputModal() {
  const modal = document.createElement('div');
  modal.id = 'text-input-modal';
  modal.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 1000;
  `;

  const header = document.createElement('h3');
  header.textContent = 'Enter Text';

  const input = document.createElement('textarea');
  input.style.cssText = `
    width: 300px;
    height: 100px;
    margin: 10px 0;
    padding: 5px;
    font-family: Arial;
  `;
  input.value = state.textInputValue;

  const controls = document.createElement('div');
  controls.style.cssText = `
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  `;

  const formatControls = document.createElement('div');

  const boldBtn = document.createElement('button');
  boldBtn.textContent = 'B';
  boldBtn.style.fontWeight = 'bold';
  boldBtn.addEventListener('click', () => {
    if (state.textTarget !== 'new' && typeof state.textTarget === 'number') {
      state.shapes[state.textTarget].isBold = !state.shapes[state.textTarget].isBold;
      draw();
    }
  });

  const italicBtn = document.createElement('button');
  italicBtn.textContent = 'I';
  italicBtn.style.fontStyle = 'italic';
  italicBtn.addEventListener('click', () => {
    if (state.textTarget !== 'new' && typeof state.textTarget === 'number') {
      state.shapes[state.textTarget].isItalic = !state.shapes[state.textTarget].isItalic;
      draw();
    }
  });

  formatControls.appendChild(boldBtn);
  formatControls.appendChild(italicBtn);

  const buttonControls = document.createElement('div');

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
    state.isEditingText = false;
    updateStatus();
  });

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.addEventListener('click', () => {
    const text = input.value.trim();
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
    document.body.removeChild(modal);
    state.isEditingText = false;
    updateStatus();
    draw();
  });

  buttonControls.appendChild(cancelBtn);
  buttonControls.appendChild(saveBtn);

  controls.appendChild(formatControls);
  controls.appendChild(buttonControls);

  modal.appendChild(header);
  modal.appendChild(input);
  modal.appendChild(controls);

  return { modal, input };
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
  ctx.fillText(text, pX, pY);

  if (isSelected) {
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const textHeight = fontSize * zoomLevel;

    ctx.strokeStyle = '#0066ff';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.strokeRect(
      pX - (align === 'center' ? textWidth / 2 : 0) - 5,
      pY - textHeight + 3,
      textWidth + 10,
      textHeight + 10
    );
    ctx.setLineDash([]);
  }
}
