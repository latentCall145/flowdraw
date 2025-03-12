# FlowDraw - A Vim-Inspired Whiteboard Web App

## Disclaimer
This is an experiment with vibe coding - kind of. 95% of the code was generated with Claude 3.7 Sonnet and this README was generated with Gemini 2.0 (except this disclaimer) over a weekend, although I had to fix bugs myself because Claude has super low rate limits. Also the app has a bunch of things I need to fix (e.g. there's no copy/paste, no resizing/editing shapes, etc.), so definitely not usable yet. Alright, end of human-written disclaimer.

FlowDraw is a web-based whiteboard application designed for creating diagrams, flowcharts, and quick sketches. It features a grid-based canvas and Vim-like keyboard shortcuts for efficient navigation and drawing, eliminating the need for constant mouse interaction.  This README provides comprehensive documentation on how to use all of FlowDraw's features.

## Table of Contents

1.  [Getting Started](#getting-started)
2.  [Basic Navigation](#basic-navigation)
3.  [Drawing Shapes](#drawing-shapes)
    *   [Rectangles](#rectangles)
    *   [Lines](#lines)
    *   [Text](#text)
4.  [Selection](#selection)
    *   [Single Selection](#single-selection)
    *   [Multi-Selection](#multi-selection)
5. [Moving and Deleting Shapes](#moving-and-deleting-shapes)
6.  [Zooming and Panning](#zooming-and-panning)
7.  [Grid Management](#grid-management)
8.  [Text Editing](#text-editing)
9.  [Exporting](#exporting)
10. [Keyboard Shortcuts Summary](#keyboard-shortcuts-summary)

## 1. Getting Started <a name="getting-started"></a>

Simply open the `index.html` file in a modern web browser (Chrome, Firefox, Safari, or Edge recommended).  No installation or server setup is required. The application runs entirely client-side.

## 2. Basic Navigation <a name="basic-navigation"></a>

FlowDraw uses a grid-based system.  You navigate using Vim-like keybindings:

*   **`h` or `ArrowLeft`**: Move the cursor one grid unit to the left.
*   **`j` or `ArrowDown`**: Move the cursor one grid unit down.
*   **`k` or `ArrowUp`**: Move the cursor one grid unit up.
*   **`l` or `ArrowRight`**: Move the cursor one grid unit to the right.

The red crosshair cursor indicates your current position on the grid.  The status bar at the top of the screen displays the current grid size and the current mode.

## 3. Drawing Shapes <a name="drawing-shapes"></a>

FlowDraw supports drawing rectangles, lines, and text.

### 3.1 Rectangles <a name="rectangles"></a>

1.  **`r`**: Enter "Rectangle: Select First Point" mode. The cursor's position will be the first corner of the rectangle.
2.  **`Space`**:  Fix the first corner of the rectangle at the current cursor position.  The mode changes to "Rectangle: Select Second Point".  A temporary rectangle will be drawn from the first corner to the current cursor position.
3.  **Move the cursor (`h`, `j`, `k`, `l`)**:  Adjust the size and position of the temporary rectangle.
4.  **`Space`**: Fix the second corner, creating the rectangle.  The mode returns to "Rectangle: Select First Point", allowing you to immediately draw another rectangle.
5. **`Escape`**: Exit rectangle drawing mode

### 3.2 Lines <a name="lines"></a>

1.  **`a`**: Enter "Line: Select First Point" mode.
2.  **`Space`**: Fix the starting point of the line at the current cursor position. The mode changes to "Line: Select Second Point". A temporary line will be drawn from the starting point to the cursor.
3.  **Move the cursor (`h`, `j`, `k`, `l`)**: Adjust the endpoint of the temporary line.
4.  **`Space`**: Fix the endpoint, creating the line. The mode returns to "Line: Select First Point".
5. **`Escape`**: Exit line drawing mode

**Arrowheads (While in "Line: Select Second Point" mode):**

*   **`n`**: Add an arrowhead to the *end* of the line (the second point you set).
*   **`m`**: Add arrowheads to *both* ends of the line.
*   **`b`**: Remove arrowheads (sets arrow style to 'none').

These keys (`n`, `m`, `b`) *must* be pressed *before* you press `Space` to finalize the line.  You can switch between arrowhead styles as much as you want before fixing the endpoint.

### 3.3 Text <a name="text"></a>

1.  **`i`**: Enter text insertion mode.  A dynamic text editor will appear at the cursor's location.
2.  **Type your text**:  The text editor will automatically resize as you type.
3.  **`Shift` + `Enter`**: Insert a newline within the text editor.
4.  **`Enter`** (without `Shift`):  Save the text and exit text editing mode. The text will be added to the canvas as a shape.
5. **`Escape`**: Cancel text insertion mode.

## 4. Selection <a name="selection"></a>

FlowDraw supports both single and multi-selection of shapes.  Selected shapes are highlighted in blue.

### 4.1 Single Selection <a name="single-selection"></a>

*   **`Space`**: Select the shape under the cursor. If multiple shapes overlap, pressing `Space` repeatedly cycles through them, from top-most to bottom-most.
* **`Shift` + `Space`**: Cycles through overlapping shapes in reverse order (bottom to top).
*   **`Escape`**: Deselect all shapes.

### 4.2 Multi-Selection <a name="multi-selection"></a>

1.  **`Ctrl` + `Space`**: Enter multi-select mode.  A selection box will appear, starting at the current cursor position.
2.  **Move the cursor (`h`, `j`, `k`, `l`)**:  Resize the selection box. The starting corner remains fixed, and the opposite corner moves with the cursor.
3.  **`Space`**: Finalize the selection.  All shapes within the selection box will be selected.  The behavior depends on the direction of the selection box:
    *   **Left-to-right (Blue box)**:  Shapes must be *fully enclosed* within the box to be selected.
    *   **Right-to-left (Green box)**: Shapes that are *partially or fully enclosed* within the box will be selected.
4. **`Escape`**: Exit multi-select mode

## 5. Moving and Deleting Shapes <a name="moving-and-deleting-shapes"></a>

*   **Select one or more shapes.**
*   **`H`**: Move the selected shape(s) one grid unit to the left.
*   **`J`**: Move the selected shape(s) one grid unit down.
*   **`K`**: Move the selected shape(s) one grid unit up.
*   **`L`**: Move the selected shape(s) one grid unit to the right.
*   **`d` or `Delete`**: Delete the selected shape(s).

The `HJKL` movement keys operate on *all* selected shapes simultaneously.  If you have multiple shapes selected, they will all move together.

## 6. Zooming and Panning <a name="zooming-and-panning"></a>

*   **`+` or `=`**: Zoom in (increase zoom level).
*   **`-` or `_`**: Zoom out (decrease zoom level).

Panning is automatic. The center of the canvas is always at grid coordinates (0, 0).  As you move the cursor and draw shapes, the view will adjust to keep the content visible.

## 7. Grid Management <a name="grid-management"></a>

*   **`[`**: Increase the grid size (make the grid coarser).
*   **`]`**: Decrease the grid size (make the grid finer).
* When increasing grid size with `[`, the cursor will automatically snap to the closest grid intersection

## 8. Text Editing <a name="text-editing"></a>

1.  **Select a text shape:** Use `Space` to select a text shape.
2.  The text editor appears immediately upon text selection.
3. **Edit Text**: Type as usual, enter new text.
4.  **`Shift` + `Enter`**: Insert a newline within the text editor.
5.  **`Enter`** (without `Shift`):  Save the changes to the text and exit editing mode.
6. **`Escape`**: Discard the changes.

## 9. Exporting <a name="exporting"></a>

*   **`Ctrl` + `e`**: Export the current canvas as a PNG image.  The image will be downloaded automatically, and a message will briefly appear in the status bar. The exported image will have a white background and will *not* include the grid or cursor.

## 10. Keyboard Shortcuts Summary <a name="keyboard-shortcuts-summary"></a>

| Key(s)                       | Action                                                                                                                                                 |
| :--------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `h` / `ArrowLeft`            | Move cursor left                                                                                                                                       |
| `j` / `ArrowDown`            | Move cursor down                                                                                                                                       |
| `k` / `ArrowUp`              | Move cursor up                                                                                                                                         |
| `l` / `ArrowRight`           | Move cursor right                                                                                                                                       |
| `[`                          | Increase grid size                                                                                                                                      |
| `]`                          | Decrease grid size                                                                                                                                      |
| `r`                          | Start rectangle drawing                                                                                                                                 |
| `a`                          | Start line drawing                                                                                                                                      |
| `i`                          | Start text insertion                                                                                                                                    |
| `Space`                      | Select shape / Fix shape point / Finalize multi-select                                                                                                 |
| `Shift` + `Space`                 | Reverse shape cycling                                                                                                                          |
| `Ctrl` + `Space`             | Enter multi-select mode                                                                                                                              |
| `n` (in line drawing mode)  | Add arrowhead to end of line                                                                                                                           |
| `m` (in line drawing mode)  | Add arrowheads to both ends of line                                                                                                                     |
| `b` (in line drawing mode)   | Remove arrowheads (none)                                                                                                                             |
| `H` (with selected shape)   | Move selected shape(s) left                                                                                                                            |
| `J` (with selected shape)   | Move selected shape(s) down                                                                                                                            |
| `K` (with selected shape)   | Move selected shape(s) up                                                                                                                              |
| `L` (with selected shape)   | Move selected shape(s) right                                                                                                                            |
| `d` / `Delete`              | Delete selected shape(s)                                                                                                                             |
| `+` / `=`                    | Zoom in                                                                                                                                                |
| `-` / `_`                    | Zoom out                                                                                                                                               |
| `Ctrl` + `e`                 | Export to PNG                                                                                                                                           |
| `Enter` (in text edit mode) | Save Text                                                                                                      |
| `Shift + Enter` (in text edit mode) | Insert new line                                                                                                                                    |
| `Escape`                     | Cancel action / Deselect / Exit mode / Discard text input |
