// state.js
const state = {
  mode: 'navigate',
  shapes: [],
  tempShape: null,
  selectedShapeIndex: -1,
  startX: 0,
  startY: 0,
  isEditingText: false,
  textInputValue: '',
  textTarget: null,
  zIndexCounter: 0,
  arrowStyle: 'none',

  // multi-item select
  multiSelectMode: false,
  selectedShapeIndices: [],
  selectionBox: null,
  selectionDirection: null, // 'left-to-right' or 'right-to-left'
};
