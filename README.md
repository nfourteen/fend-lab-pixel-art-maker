## Drag to Paint Functionality

The original implementation looked like this:

```
let isMousePressed = false;
document.onmousedown = () => isMousePressed = true;
document.onmouseup = () => isMousePressed = false;

const dragHandler = (event) => {
    if (event.target.nodeName === 'TD' && isMousePressed) {
        event.target.style.background = colorPicker.value;
    }
};

pixelCanvas.onmouseover = dragHandler;
// onmouseout captured the cell under the mouse when it was pressed so it
// was colored too. The current implementation just calls the dragHandler
// onmousedown to effectively do the same thing
pixelCanvas.onmouseout = dragHandler;
```
