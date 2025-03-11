// events.js
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    state.mode = 'navigate';
    state.tempShape = null;
    state.selectedShapeIndex = -1;
    state.selectedShapeIndices = [];
    state.multiSelectMode = false;
    state.selectionBox = null;
  }

  if (!state.isEditingText && e.key === 'i') {
    e.preventDefault();
  }
  // Space key for selection
  if (e.key === ' ' && e.ctrlKey && state.mode === 'navigate' && !state.isEditingText) {
    e.preventDefault();
    
    state.multiSelectMode = true;
    state.currentlySelecting = true;
    state.startX = cursorX;
    state.startY = cursorY;
    state.selectionBox = {
      x1: cursorX,
      y1: cursorY,
      x2: cursorX,
      y2: cursorY
    };
    
    // We'll determine the direction once the mouse moves
    draw();
    return;
  }
  //
  else if (e.key === ' ' && state.mode === 'navigate' && !state.isEditingText) {
    e.preventDefault();
    
    // Try to select a shape under the cursor
    let selectedIndex = -1;
    
    // Check shapes in reverse order (top-most first)
    let inc = e.shiftKey ? 1 : -1; // go fwd (go from objects made recently to objects made early) if no shift key, bwd if shift
    let selectedIndexStart = (state.selectedShapeIndex != -1) ? state.selectedShapeIndex + inc : state.shapes.length - 1;
    selectedIndexStart = (selectedIndexStart + state.shapes.length) % state.shapes.length; // allows negative and positive cycling
    var niters = 0;
    while (niters < state.shapes.length && selectedIndex == -1) {
      var i = selectedIndexStart + inc * niters;
      i = (i + state.shapes.length) % state.shapes.length; // allows negative and positive cycling
      const shape = state.shapes[i];
      
      if (shape.type === 'rectangle' && isPointInRectangle(cursorX, cursorY, shape)) {
        selectedIndex = i;
      } else if (shape.type === 'line' && isPointNearLine(cursorX, cursorY, shape)) {
        selectedIndex = i;
      } else if ((shape.type === 'text' || shape.type === 'label') && 
                 isPointInText(cursorX, cursorY, shape)) {
        selectedIndex = i;
      }
      niters = niters + 1;
    }
    
    state.selectedShapeIndex = selectedIndex;
    updateStatus();
    draw();
    return;
  }
  
  // Move selected shape with H, J, K, L (case-sensitive)
  /*if (state.selectedShapeIndex !== -1 && !state.isEditingText) {
    const shape = state.shapes[state.selectedShapeIndex];
    
    if (e.key === 'H') {
      e.preventDefault();
      if (shape.type === 'rectangle' || shape.type === 'line') {
        shape.x1 -= gridSize;
        shape.x2 -= gridSize;
      } else if (shape.type === 'text' || shape.type === 'label') {
        shape.x -= gridSize;
      }
      draw();
      return;
    } else if (e.key === 'L') {
      e.preventDefault();
      if (shape.type === 'rectangle' || shape.type === 'line') {
        shape.x1 += gridSize;
        shape.x2 += gridSize;
      } else if (shape.type === 'text' || shape.type === 'label') {
        shape.x += gridSize;
      }
      draw();
      return;
    } else if (e.key === 'K') {
      e.preventDefault();
      if (shape.type === 'rectangle' || shape.type === 'line') {
        shape.y1 -= gridSize;
        shape.y2 -= gridSize;
      } else if (shape.type === 'text' || shape.type === 'label') {
        shape.y -= gridSize;
      }
      draw();
      return;
    } else if (e.key === 'J') {
      e.preventDefault();
      if (shape.type === 'rectangle' || shape.type === 'line') {
        shape.y1 += gridSize;
        shape.y2 += gridSize;
      } else if (shape.type === 'text' || shape.type === 'label') {
        shape.y += gridSize;
      }
      draw();
      return;
    }
    
    // Delete selected shape with Delete key
    if (e.key === 'd' || e.key === 'Delete') {
      e.preventDefault();
      state.shapes.splice(state.selectedShapeIndex, 1);
      state.selectedShapeIndex = -1;
      updateStatus();
      draw();
      return;
    }
  }*/
  // Modify the movement and deletion to work with multi-selection
  if ((state.selectedShapeIndex !== -1 || state.selectedShapeIndices.length > 0) && !state.isEditingText) {
    // Get all indices to operate on
    const indicesToOperate = state.multiSelectMode ? 
      state.selectedShapeIndices : 
      [state.selectedShapeIndex];
    
    if (e.key === 'H') {
      e.preventDefault();
      for (const index of indicesToOperate) {
        const shape = state.shapes[index];
        if (shape.type === 'rectangle' || shape.type === 'line') {
          shape.x1 -= gridSize;
          shape.x2 -= gridSize;
        } else if (shape.type === 'text' || shape.type === 'label') {
          shape.x -= gridSize;
        }
      }
      draw();
      return;
    } else if (e.key === 'L') {
      e.preventDefault();
      for (const index of indicesToOperate) {
        const shape = state.shapes[index];
        if (shape.type === 'rectangle' || shape.type === 'line') {
          shape.x1 += gridSize;
          shape.x2 += gridSize;
        } else if (shape.type === 'text' || shape.type === 'label') {
          shape.x += gridSize;
        }
      }
      draw();
      return;
    } else if (e.key === 'K') {
      e.preventDefault();
      for (const index of indicesToOperate) {
        const shape = state.shapes[index];
        if (shape.type === 'rectangle' || shape.type === 'line') {
          shape.y1 -= gridSize;
          shape.y2 -= gridSize;
        } else if (shape.type === 'text' || shape.type === 'label') {
          shape.y -= gridSize;
        }
      }
      draw();
      return;
    } else if (e.key === 'J') {
      e.preventDefault();
      for (const index of indicesToOperate) {
        const shape = state.shapes[index];
        if (shape.type === 'rectangle' || shape.type === 'line') {
          shape.y1 += gridSize;
          shape.y2 += gridSize;
        } else if (shape.type === 'text' || shape.type === 'label') {
          shape.y += gridSize;
        }
      }
      draw();
      return;
    }
    
    // Delete selected shapes with Delete key
    if (e.key === 'd' || e.key === 'Delete') {
      e.preventDefault();
      
      // Sort indices in descending order to avoid shifting issues when deleting
      const sortedIndices = [...indicesToOperate].sort((a, b) => b - a);
      
      for (const index of sortedIndices) {
        state.shapes.splice(index, 1);
      }
      
      state.selectedShapeIndex = -1;
      state.selectedShapeIndices = [];
      state.multiSelectMode = false;
      updateStatus();
      draw();
      return;
    }
  }

  // Add these mouse event handlers
  /*document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Update cursor position
    cursorX = Math.floor(mouseX / gridSize) * gridSize;
    cursorY = Math.floor(mouseY / gridSize) * gridSize;
    
    // Update selection box if in multi-select mode and currently selecting
    if (state.multiSelectMode && state.currentlySelecting) {
      state.selectionBox.x2 = cursorX;
      state.selectionBox.y2 = cursorY;
      
      // Determine selection direction
      if (state.selectionBox.x2 >= state.selectionBox.x1) {
        state.selectionDirection = 'left-to-right'; // Blue, fully enclosed
      } else {
        state.selectionDirection = 'right-to-left'; // Green, partially enclosed
      }
      
      draw();
    }
    
    // Other existing mousemove code...
  });

  document.addEventListener('mouseup', (e) => {
    if (state.multiSelectMode && state.currentlySelecting) {
      state.currentlySelecting = false;
      
      // Normalize the selection box coordinates
      const selBox = {
        x1: Math.min(state.selectionBox.x1, state.selectionBox.x2),
        y1: Math.min(state.selectionBox.y1, state.selectionBox.y2),
        x2: Math.max(state.selectionBox.x1, state.selectionBox.x2),
        y2: Math.max(state.selectionBox.y1, state.selectionBox.y2)
      };
      
      // Clear previous selection
      state.selectedShapeIndices = [];
      
      // Select shapes based on the selection box and direction
      for (let i = 0; i < state.shapes.length; i++) {
        const shape = state.shapes[i];
        
        if (shape.type === 'rectangle') {
          // For left-to-right (blue), shapes must be fully enclosed
          if (state.selectionDirection === 'left-to-right') {
            if (isRectangleFullyEnclosed(shape, selBox)) {
              state.selectedShapeIndices.push(i);
            }
          } 
          // For right-to-left (green), shapes can be partially enclosed
          else {
            if (isRectanglePartiallyEnclosed(shape, selBox)) {
              state.selectedShapeIndices.push(i);
            }
          }
        } else if (shape.type === 'line') {
          // For left-to-right (blue), line must be fully enclosed
          if (state.selectionDirection === 'left-to-right') {
            if (isLineFullyEnclosed(shape, selBox)) {
              state.selectedShapeIndices.push(i);
            }
          } 
          // For right-to-left (green), line can be partially enclosed
          else {
            if (isLinePartiallyEnclosed(shape, selBox)) {
              state.selectedShapeIndices.push(i);
            }
          }
        } else if (shape.type === 'text' || shape.type === 'label') {
          // For text objects
          if (state.selectionDirection === 'left-to-right') {
            if (isTextFullyEnclosed(shape, selBox)) {
              state.selectedShapeIndices.push(i);
            }
          } else {
            if (isTextPartiallyEnclosed(shape, selBox)) {
              state.selectedShapeIndices.push(i);
            }
          }
        }
      }
      
      draw();
    }
    
    // Other existing mouseup code...
  });*/

  // Rest of the existing keydown handler...
  if (!state.isEditingText && e.key === 't') {
    e.preventDefault();
  }
  
  if (state.isEditingText) {
    return;
  }

  // Check for Ctrl+E for export
  if (e.ctrlKey && e.key === 'e') {
    e.preventDefault();
    exportToPNG();
    return;
  }

  // Add zoom controls with - and + keys
  if (e.key === '-' || e.key === '_') {
    e.preventDefault();
    if (zoomLevel > 0.2) {
      zoomLevel *= 0.8;
      updateStatus();
      draw();
    }
    return;
  }
  
  if (e.key === '=' || e.key === '+') {
    e.preventDefault();
    if (zoomLevel < 5) {
      zoomLevel *= 1.25;
      updateStatus();
      draw();
    }
    return;
  }
  
  // Fix the [ and ] keys to only change grid size without affecting position
  if (e.key === ']') {
    e.preventDefault();
    if (gridSize > 4) {
      gridSize /= 2;
      updateStatus();
      draw();
    }
    return;
  } 
  
  if (e.key === '[') {
    e.preventDefault();
    if (gridSize < 320) {
      gridSize *= 2;
      // snap cursor to nearest grid junction
      cursorX = Math.floor(cursorX / gridSize) * gridSize; 
      cursorY = Math.floor(cursorY / gridSize) * gridSize;
      updateStatus();
      draw();
    }
    return;
  }

  if (e.key === 'h' || e.key == 'ArrowLeft') {
    cursorX -= gridSize;
  } else if (e.key === 'l' || e.key == 'ArrowRight') {
    cursorX += gridSize;
  } else if (e.key === 'k' || e.key == 'ArrowUp') {
    cursorY -= gridSize;
  } else if (e.key === 'j' || e.key == 'ArrowDown') {
    cursorY += gridSize;
  }

  if (e.key === 'r') {
    state.mode = 'rectangle-start';
    state.tempShape = null;
  }
  else if (e.key === ' ') {
    if (state.mode === 'rectangle-start') {
      state.startX = cursorX;
      state.startY = cursorY;
      state.tempShape = {
        type: 'rectangle',
        x1: cursorX,
        y1: cursorY
      };
      state.mode = 'rectangle-end';
    } else if (state.mode === 'rectangle-end') {
      state.shapes.push({
        type: 'rectangle',
        x1: state.tempShape.x1,
        y1: state.tempShape.y1,
        x2: cursorX,
        y2: cursorY,
        zIndex: state.zIndexCounter++
      });
      state.tempShape = null;
      state.mode = 'rectangle-start';
    }
  }

  if (e.key === 'a') {
    state.mode = 'line-start';
    state.tempShape = null;
  }
  else if (e.key === ' ') {
    if (state.mode === 'line-start') {
      state.startX = cursorX;
      state.startY = cursorY;
      state.tempShape = {
        type: 'line',
        x1: cursorX,
        y1: cursorY,
        arrowStyle: state.arrowStyle
      };
      state.mode = 'line-end';
    } else if (state.mode === 'line-end') {
      state.shapes.push({
        type: 'line',
        x1: state.tempShape.x1,
        y1: state.tempShape.y1,
        x2: cursorX,
        y2: cursorY,
        arrowStyle: state.tempShape.arrowStyle,
        zIndex: state.zIndexCounter++
      });
      state.tempShape = null;
      state.mode = 'line-start';
    }
  }

  if (state.mode === 'line-end') {
    if (e.key === 'n') {
      state.tempShape.arrowStyle = 'end';
      state.arrowStyle = 'end';
    } else if (e.key === 'm') {
      state.tempShape.arrowStyle = 'both';
      state.arrowStyle = 'both';
    } else if (e.key === 'b') {
      state.tempShape.arrowStyle = 'none';
      state.arrowStyle = 'none';
    }
  }

  if (e.key === 'i') {
    state.textTarget = 'new';
    state.textInputValue = '';
    state.isEditingText = true;
    state.tempShape = null;

    const { modal, input } = createTextInputModal();
    document.body.appendChild(modal);
    input.focus();
  }

  updateStatus();
  draw();
});
